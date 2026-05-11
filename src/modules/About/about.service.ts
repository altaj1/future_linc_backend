import { BaseService } from '@/core/BaseService';
import { PrismaClient } from '@/generated/prisma/client';
import { PaginationOptions } from '@/types/types';
import { CreateAboutInput, UpdateAboutInput } from './about.validation';
import { uploadToLocal, deleteLocalFile } from '@/utils/localupload';

export class AboutService extends BaseService<any, CreateAboutInput, UpdateAboutInput> { 
    
    constructor(prisma: PrismaClient) {
        super(prisma, 'About', {
            enableSoftDelete: true,
            enableAuditFields: true
        });
    }

    protected getModel() {
        // @ts-ignore - The model 'about' might not exist in PrismaClient types yet
        return this.prisma.about; 
    }

    // =========================================================================
    // Public API - Exposing BaseService methods
    // Since BaseService methods are protected, we must expose them here
    // =========================================================================

    public async create(data: CreateAboutInput, files?: { [fieldname: string]: Express.Multer.File[] }, include?: any) {
        let image1Data: any = undefined;
        let image2Data: any = undefined;

        if (files?.image1?.[0]) {
            image1Data = await uploadToLocal(`about-${data.section}-1`, files.image1[0].path, 'about');
        }
        if (files?.image2?.[0]) {
            image2Data = await uploadToLocal(`about-${data.section}-2`, files.image2[0].path, 'about');
        }

        const aboutData = {
            ...data,
            image1: image1Data?.url,
            image1PublicId: image1Data?.publicId,
            image2: image2Data?.url,
            image2PublicId: image2Data?.publicId,
        };

        return super.create(aboutData, include);
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

    public async updateById(id: string, data: UpdateAboutInput, files?: { [fieldname: string]: Express.Multer.File[] }, include?: any) {
        const existingRecord = await this.findById(id);
        let image1Data: any = undefined;
        let image2Data: any = undefined;

        if (files?.image1?.[0]) {
            if (existingRecord?.image1PublicId) {
                await deleteLocalFile(existingRecord.image1PublicId, 'about');
            }
            image1Data = await uploadToLocal(`about-${data.section || existingRecord.section}-1`, files.image1[0].path, 'about');
        }

        if (files?.image2?.[0]) {
            if (existingRecord?.image2PublicId) {
                await deleteLocalFile(existingRecord.image2PublicId, 'about');
            }
            image2Data = await uploadToLocal(`about-${data.section || existingRecord.section}-2`, files.image2[0].path, 'about');
        }

        const updateData = {
            ...data,
            ...(image1Data && { image1: image1Data.url, image1PublicId: image1Data.publicId }),
            ...(image2Data && { image2: image2Data.url, image2PublicId: image2Data.publicId }),
        };

        return super.updateById(id, updateData as any, include);
    }

    public async deleteById(id: string) {
        const existingRecord = await this.findById(id);
        const result = await super.deleteById(id);
        
        if (existingRecord?.image1PublicId) {
            await deleteLocalFile(existingRecord.image1PublicId, 'about');
        }
        if (existingRecord?.image2PublicId) {
            await deleteLocalFile(existingRecord.image2PublicId, 'about');
        }
        
        return result;
    }

    public async exists(filters: any) {
        return super.exists(filters);
    }
}
