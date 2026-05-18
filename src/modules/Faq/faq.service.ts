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
    include?: any,
  ) {
    return super.create(data, include);
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
    include?: any,
  ) {
    return super.updateById(id, data as any, include);
  }

  public async deleteById(id: string) {
    return super.deleteById(id);
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }

  public async getFaqSection() {
    let section = await this.prisma.faqSection.findFirst();
    if (!section) {
      section = await this.prisma.faqSection.create({
        data: { title: "FREQUENTLY ASKED QUESTIONS" },
      });
    }
    return section;
  }

  public async updateFaqSection(data: any, imageFile?: Express.Multer.File) {
    const section = await this.getFaqSection();
    let imageData: any = undefined;

    if (imageFile) {
      if (section.imagePublicId) {
        await deleteLocalFile(section.imagePublicId, "faqs");
      }
      const uploaded = await uploadToLocal(`faq-section-${Date.now()}`, imageFile.path, "faqs");
      imageData = uploaded;
    }

    const updateData = {
      ...data,
      ...(imageData && {
        image: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };

    return this.prisma.faqSection.update({
      where: { id: section.id },
      data: updateData,
    });
  }

  public async getContent() {
    const section = await this.getFaqSection();
    const faqs = await this.prisma.faq.findMany({
      orderBy: { createdAt: 'asc' }
    });

    return {
      Title: section.title,
      image: section.image,
      faq: faqs.map(f => ({ qu: f.question, ans: f.answer }))
    };
  }
}
