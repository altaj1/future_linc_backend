import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import {
  CreateUniversityPartnerInput,
  UpdateUniversityPartnerInput,
} from "./universityPartner.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class UniversityPartnerService extends BaseService<
  any,
  CreateUniversityPartnerInput,
  UpdateUniversityPartnerInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "UniversityPartner", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore
    return this.prisma.universityPartner;
  }

  public async create(
    data: CreateUniversityPartnerInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        data.name,
        imageFile.path,
        "university-partners",
      );
      imageData = uploaded;
    }
    const partnerData = {
      ...data,
      logo: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    return super.create(partnerData, include);
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
    data: UpdateUniversityPartnerInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(
          existingRecord.imagePublicId,
          "university-partners",
        );
      }
      const uploaded = await uploadToLocal(
        data.name || `partner-${id}`,
        imageFile.path,
        "university-partners",
      );
      imageData = uploaded;
    }
    const updateData = {
      ...data,
      ...(imageData && {
        logo: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };
    return super.updateById(id, updateData as any, include);
  }

  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);
    const result = await super.deleteById(id);
    if (existingRecord && existingRecord.imagePublicId) {
      await deleteLocalFile(
        existingRecord.imagePublicId,
        "university-partners",
      );
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
