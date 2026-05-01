import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import {
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "./testimonial.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class TestimonialService extends BaseService<
  any,
  CreateTestimonialInput,
  UpdateTestimonialInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Testimonial", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore
    return this.prisma.testimonial;
  }

  public async create(
    data: CreateTestimonialInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        data.name,
        imageFile.path,
        "testimonials",
      );
      imageData = uploaded;
    }
    const testimonialData = {
      ...data,
      image: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    return super.create(testimonialData, include);
  }

  public async findMany(
    filters: any = {},
    pagination?: Partial<PaginationOptions>,
    orderBy?: any,
    include?: any,
  ) {
    return super.findMany(filters, pagination, orderBy, include);
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  public async updateById(
    id: string,
    data: UpdateTestimonialInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "testimonials");
      }
      const uploaded = await uploadToLocal(
        data.name || `testimonial-${id}`,
        imageFile.path,
        "testimonials",
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
      await deleteLocalFile(existingRecord.imagePublicId, "testimonials");
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
