import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import { CreateBlogInput, UpdateBlogInput } from "./blog.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class BlogService extends BaseService<
  any,
  CreateBlogInput,
  UpdateBlogInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Blog", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'blog' might not exist in PrismaClient types yet
    return this.prisma.blog;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // Since BaseService methods are protected, we must expose them here
  // =========================================================================

  public async create(
    data: CreateBlogInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const slug = await this.generateUniqueSlug(data.title);
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(data.title, imageFile.path, "blogs");
      console.log({ uploaded });
      imageData = uploaded;
    }
    const blogData = {
      ...data,
      slug,
      image: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    console.log({ blogData });
    return super.create(blogData, include);
  }

  public async findMany(
    filters: any = {},
    pagination?: Partial<PaginationOptions>,
    orderBy?: any,
    include?: any,
  ) {
    console.log({ filters });
    return super.findMany(filters, pagination, orderBy, include);
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  public async updateById(
    id: string,
    data: UpdateBlogInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "blogs");
      }
      const uploaded = await uploadToLocal(
        data.title || `blog-${id}`,
        imageFile.path,
        "blogs",
      );
      imageData = uploaded;
    }
    const updateData = {
      ...data,
      ...(imageData && {
        image: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };
    return super.updateById(id, updateData as any, include);
  }

  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);
    const result = await super.deleteById(id);
    if (existingRecord && existingRecord.imagePublicId) {
      await deleteLocalFile(existingRecord.imagePublicId, "blogs");
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
