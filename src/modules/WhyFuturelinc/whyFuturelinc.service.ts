import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { UpsertWhyFuturelincInput } from "./whyFuturelinc.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class WhyFuturelincService extends BaseService<
  any,
  UpsertWhyFuturelincInput,
  UpsertWhyFuturelincInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "WhyFuturelinc", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'whyFuturelinc' exists in PrismaClient
    return this.prisma.whyFuturelinc;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // =========================================================================

  /**
   * Get the count of existing WhyFuturelinc records (used for upsert logic)
   */
  public async getCount(): Promise<number> {
    return this.getModel().count();
  }

  /**
   * Find the first (and only) WhyFuturelinc record
   */
  public async findFirst(): Promise<any | null> {
    return this.getModel().findFirst();
  }

  /**
   * Create a new WhyFuturelinc record with optional image upload
   */
  public async create(
    data: UpsertWhyFuturelincInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;

    if (imageFile) {
      const uploaded = await uploadToLocal(
        `why-futurelinc-${data.title}`,
        imageFile.path,
        "whyFuturelinc",
      );
      imageData = uploaded;
    }
    console.log({ data });
    const createData = {
      ...data,
      //   title: data.title, // map to DB field (capital T)
      thambnail: imageData?.url,
      imagePublicId: imageData?.publicId,
    };

    // Remove the lowercase 'title' key since DB uses 'Title'
    // delete (createData as any).title;

    return super.create(createData, include);
  }

  /**
   * Update an existing WhyFuturelinc record by ID with optional image replacement
   */
  public async updateById(
    id: string,
    data: UpsertWhyFuturelincInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;

    if (imageFile) {
      // Delete the old image before uploading the new one
      if (existingRecord?.imagePublicId) {
        await deleteLocalFile(existingRecord.imagePublicId, "whyFuturelinc");
      }
      const uploaded = await uploadToLocal(
        `why-futurelinc-${data.title || "record"}`,
        imageFile.path,
        "whyFuturelinc",
      );
      imageData = uploaded;
    }

    const updateData: any = {
      ...data,
      title: data.title, // map to DB field (capital T)
      ...(imageData && {
        thambnail: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };

    // Remove the lowercase 'title' key since DB uses 'Title'
    delete updateData.title;

    return super.updateById(id, updateData, include);
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  /**
   * Delete a WhyFuturelinc record by ID and remove its associated image
   */
  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);
    const result = await super.deleteById(id);

    if (existingRecord?.imagePublicId) {
      await deleteLocalFile(existingRecord.imagePublicId, "whyFuturelinc");
    }

    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
