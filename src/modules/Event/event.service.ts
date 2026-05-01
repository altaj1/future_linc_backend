import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import { CreateEventInput, UpdateEventInput } from "./event.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class EventService extends BaseService<
  any,
  CreateEventInput,
  UpdateEventInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "Event", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'event' might not exist in PrismaClient types yet
    return this.prisma.event;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // Since BaseService methods are protected, we must expose them here
  // =========================================================================

  public async create(
    data: CreateEventInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;
    if (imageFile) {
      const uploaded = await uploadToLocal(
        data.title || `event-${Date.now()}`,
        imageFile.path,
        "events",
      );
      imageData = uploaded;
    }
    const eventData = {
      ...data,
      image: imageData?.url,
      imagePublicId: imageData?.publicId,
    };
    console.log({ eventData });
    return super.create(eventData, include);
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
    data: UpdateEventInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;
    if (imageFile) {
      if (existingRecord && existingRecord.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "events");
      }
      const uploaded = await uploadToLocal(
        data.title || `event-${id}`,
        imageFile.path,
        "events",
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
      await deleteLocalFile(existingRecord.imagePublicId, "events");
    }
    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
