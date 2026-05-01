import { BaseService } from '@/core/BaseService';
import { PrismaClient } from '@/generated/prisma/client';
import { PaginationOptions } from '@/types/types';
import { CreateAboutContentInput, UpdateAboutContentInput } from './aboutContent.validation';

export class AboutContentService extends BaseService<any, CreateAboutContentInput, UpdateAboutContentInput> { 
    
    constructor(prisma: PrismaClient) {
        super(prisma, 'AboutContent', {
            enableSoftDelete: false,
            enableAuditFields: true
        });
    }

    protected getModel() {
        // @ts-ignore - The model 'aboutContent' might not exist in PrismaClient types yet
        return this.prisma.aboutContent; 
    }

    // =========================================================================
    // Public API - Exposing BaseService methods
    // Since BaseService methods are protected, we must expose them here
    // =========================================================================

    public async create(data: CreateAboutContentInput, include?: any) {
        return super.create(data, include);
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

    public async updateById(id: string, data: UpdateAboutContentInput, include?: any) {
        return super.updateById(id, data, include);
    }

    public async deleteById(id: string) {
        return super.deleteById(id);
    }

    public async exists(filters: any) {
        return super.exists(filters);
    }
}
