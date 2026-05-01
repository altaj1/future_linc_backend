import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import { CreateFaqInput, UpdateFaqInput } from "./faq.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class FaqService extends BaseService<
  any,
  CreateFaqInput,
  UpdateFaqInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Faq", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore
    return this.prisma.faq;
  }

  public async create(
    data: CreateFaqInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        `faq-${Date.now()}`,
        imageFile.path,
        "faqs",
      );
      imageData = uploaded;
    }
    const faqData = {
      ...data,
      image: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    return super.create(faqData, include);
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
    data: UpdateFaqInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "faqs");
      }
      const uploaded = await uploadToLocal(`faq-${id}`, imageFile.path, "faqs");
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
      await deleteLocalFile(existingRecord.imagePublicId, "faqs");
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
