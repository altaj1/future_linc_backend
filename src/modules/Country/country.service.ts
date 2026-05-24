import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import { CreateCountryInput, UpdateCountryInput } from "./country.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class CountryService extends BaseService<
  any,
  CreateCountryInput,
  UpdateCountryInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Country", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'country' might not exist in PrismaClient types yet
    return this.prisma.country;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // Since BaseService methods are protected, we must expose them here
  // =========================================================================

  public async create(
    data: CreateCountryInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        data.name,
        imageFile.path,
        "countries",
      );
      imageData = uploaded;
    }
    const countryData = {
      ...data,
      flag: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    return super.create(countryData, include);
  }

  public async findMany(
    filters: any = {},
    pagination?: Partial<PaginationOptions>,
    orderBy?: any,
    include?: any,
  ) {
    return super.findMany(filters, pagination, orderBy, {
      ...include,
      universities: true, // Include related universities by default
    });
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  public async updateById(
    id: string,
    data: UpdateCountryInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "countries");
      }
      const uploaded = await uploadToLocal(
        data.name || `country-${id}`,
        imageFile.path,
        "countries",
      );
      imageData = uploaded;
    }
    const updateData = {
      ...data,
      ...(imageData && {
        flag: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };
    return super.updateById(id, updateData as any, include);
  }

  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);

    if (existingRecord && existingRecord.imagePublicId) {
      await deleteLocalFile(existingRecord.imagePublicId, "countries");
    }
    const result = await super.deleteById(id);
    console.log({ result });
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
