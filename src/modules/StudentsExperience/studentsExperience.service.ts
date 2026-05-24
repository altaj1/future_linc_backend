import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { UpsertStudentsExperienceInput } from "./studentsExperience.validation";
import { uploadToLocal, deleteLocalFile } from "@/utils/localupload";

export class StudentsExperienceService extends BaseService<
  any,
  UpsertStudentsExperienceInput,
  UpsertStudentsExperienceInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "StudentsExperience", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'studentsExperience' exists in PrismaClient
    return this.prisma.studentsExperience;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // =========================================================================

  /**
   * Get the count of existing StudentsExperience records (used for upsert logic)
   */
  public async getCount(): Promise<number> {
    return this.getModel().count();
  }

  /**
   * Find the first (and only) StudentsExperience record
   */
  public async findFirst(): Promise<any | null> {
    return this.getModel().findFirst();
  }

  /**
   * Create a new StudentsExperience record with optional image upload
   */
  public async create(
    data: UpsertStudentsExperienceInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    let imageData: any = undefined;

    if (imageFile) {
      const uploaded = await uploadToLocal(
        `students-experience-${imageFile.originalname}`,
        imageFile.path,
        "studentsExperience",
      );
      imageData = uploaded;
    }

    const createData = {
      ...data,
      thambnail: imageData?.url,
      imagePublicId: imageData?.publicId,
    };

    return super.create(createData, include);
  }

  /**
   * Update an existing StudentsExperience record by ID with optional image replacement
   */
  public async updateById(
    id: string,
    data: UpsertStudentsExperienceInput,
    imageFile?: Express.Multer.File,
    include?: any,
  ) {
    const existingRecord = await this.findById(id);
    let imageData: any = undefined;

    if (imageFile) {
      // Delete the old image before uploading the new one
      if (existingRecord?.imagePublicId) {
        await deleteLocalFile(
          existingRecord.imagePublicId,
          "studentsExperience",
        );
      }
      const uploaded = await uploadToLocal(
        `students-experience-${imageFile.originalname}`,
        imageFile.path,
        "studentsExperience",
      );
      imageData = uploaded;
    }

    const updateData: any = {
      ...data,
      ...(imageData && {
        thambnail: imageData.url,
        imagePublicId: imageData.publicId,
      }),
    };

    return super.updateById(id, updateData, include);
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  /**
   * Delete a StudentsExperience record by ID and remove its associated image
   */
  public async deleteById(id: string) {
    const existingRecord = await this.findById(id);
    const result = await super.deleteById(id);

    if (existingRecord?.imagePublicId) {
      await deleteLocalFile(existingRecord.imagePublicId, "studentsExperience");
    }

    return result;
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
