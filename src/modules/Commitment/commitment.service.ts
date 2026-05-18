import { BaseService } from '@/core/BaseService';
import { PrismaClient } from '@/generated/prisma/client';
import { PaginationOptions } from '@/types/types';
import { CreateCommitmentInput, UpdateCommitmentInput } from './commitment.validation';
import { uploadToLocal, deleteLocalFile } from '@/utils/localupload';

export class CommitmentService extends BaseService<any, CreateCommitmentInput, UpdateCommitmentInput> { 
    
    constructor(prisma: PrismaClient) {
        super(prisma, 'Commitment', {
            enableSoftDelete: true,
            enableAuditFields: true
        });
    }

    protected getModel() {
        // @ts-ignore - The model 'commitment' might not exist in PrismaClient types yet
        return this.prisma.commitment; 
    }

    // =========================================================================
    // Public API - Exposing BaseService methods
    // Since BaseService methods are protected, we must expose them here
    // =========================================================================

    public async create(data: CreateCommitmentInput, imageFile?: Express.Multer.File, include?: any) {
        let imageData: any = undefined;
        if (imageFile) {
            const uploaded = await uploadToLocal(data.title, imageFile.path, 'commitments');
            imageData = uploaded;
        }
        const commitmentData = {
            ...data,
            icon: imageData?.url,
            imagePublicId: imageData?.publicId,
        };
        return super.create(commitmentData, include);
    }

    public async findMany(
        filters: any = {},
        pagination?: Partial<PaginationOptions>,
        orderBy?: any,
        include?: any
    ) {
        return super.findMany(filters, pagination, orderBy, include);
    }

    public async findById(id: string, include?: any) {
        return super.findById(id, include);
    }

    public async updateById(id: string, data: UpdateCommitmentInput, imageFile?: Express.Multer.File, include?: any) {
        const existingRecord = await this.findById(id);
        let imageData: any = undefined;
        if (imageFile) {
            if (existingRecord && existingRecord.imagePublicId) {
                await deleteLocalFile(existingRecord.imagePublicId, 'commitments');
            }
            const uploaded = await uploadToLocal(data.title || `commitment-${id}`, imageFile.path, 'commitments');
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
            await deleteLocalFile(existingRecord.imagePublicId, 'commitments');
        }
        return result;
    }

    public async exists(filters: any) {
        return super.exists(filters);
    }
}
