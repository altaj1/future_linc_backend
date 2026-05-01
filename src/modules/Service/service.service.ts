import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import { CreateServiceInput, UpdateServiceInput } from "./service.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class ServiceService extends BaseService<
  any,
  CreateServiceInput,
  UpdateServiceInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Service", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'service' might not exist in PrismaClient types yet
    return this.prisma.service;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // Since BaseService methods are protected, we must expose them here
  // =========================================================================

  public async create(
    data: CreateServiceInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        data.title,
        imageFile.path,
        "services",
      );
      imageData = uploaded;
    }
    const serviceData = {
      ...data,
      icon: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    return super.create(serviceData, include);
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
    data: UpdateServiceInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "services");
      }
      const uploaded = await uploadToLocal(
        data.title || `service-${id}`,
        imageFile.path,
        "services",
      );
      imageData = uploaded;
    }
    const updateData = {
      ...data,
      ...(imageData && {
        icon: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };
    return super.updateById(id, updateData as any, include);
  }

  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);
    const result = await super.deleteById(id);
    if (existingRecord && existingRecord.imagePublicId) {
      await deleteLocalFile(existingRecord.imagePublicId, "services");
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
