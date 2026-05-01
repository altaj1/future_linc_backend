import { BaseService } from '@/core/BaseService';
import { PrismaClient } from '@/generated/prisma/client';
import { PaginationOptions } from '@/types/types';
import { CreateUserInput, UpdateUserInput } from './user.validation';
import { uploadToLocal, deleteLocalFile } from '@/utils/localupload';
import bcrypt from 'bcrypt';

export class UserService extends BaseService<any, CreateUserInput, UpdateUserInput> { 
    
    constructor(prisma: PrismaClient) {
        super(prisma, 'User', {
            enableSoftDelete: true,
            enableAuditFields: true
        });
    }

    protected getModel() {
        return this.prisma.user; 
    }

    public async create(data: CreateUserInput, imageFile?: Express.Multer.File, include?: any) {
        let imageData: any = undefined;
        if (imageFile) {
            const uploaded = await uploadToLocal(`user-${Date.now()}`, imageFile.path, "avatars");
            imageData = uploaded;
        }

        let hashedPassword = data.password;
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 12);
        }

        const userData = {
            ...data,
            password: hashedPassword,
            displayName: `${data.firstName} ${data.lastName}`,
            avatarUrl: imageData?.url,
            imagePublicId: imageData?.publicId,
        };

        const created = await super.create(userData, include);
        const { password, ...safeUser } = created;
        return safeUser;
    }

    public async findMany(
        filters: any = {},
        pagination?: Partial<PaginationOptions>,
        orderBy?: any,
        include?: any
    ) {
        const result = await super.findMany(filters, pagination, orderBy, include);
        result.data = result.data.map((user: any) => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        return result;
    }

    public async findById(id: string, include?: any) {
        const result = await super.findById(id, include);
        if (result) {
            const { password, ...safeUser } = result;
            return safeUser;
        }
        return result;
    }

    public async updateById(id: string, data: UpdateUserInput, imageFile?: Express.Multer.File, include?: any) {
        const existingRecord = await this.findById(id);
        let imageData: any = undefined;
        if (imageFile) {
            if (existingRecord && (existingRecord as any).imagePublicId) {
                await deleteLocalFile((existingRecord as any).imagePublicId, "avatars");
            }
            const uploaded = await uploadToLocal(`user-${id}`, imageFile.path, "avatars");
            imageData = uploaded;
        }

        const updateData: any = { ...data };
        
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 12);
        }

        if (data.firstName || data.lastName) {
            const user = await this.getModel().findUnique({ where: { id } });
            if (user) {
                const fn = data.firstName || user.firstName;
                const ln = data.lastName || user.lastName;
                updateData.displayName = `${fn} ${ln}`;
            }
        }

        if (imageData) {
            updateData.avatarUrl = imageData.url;
            updateData.imagePublicId = imageData.publicId;
        }

        const result = await super.updateById(id, updateData as any, include);
        const { password, ...safeUser } = result;
        return safeUser;
    }

    public async deleteById(id: string) {
        const existingRecord = await this.findById(id);
        const result = await super.deleteById(id);
        if (existingRecord && (existingRecord as any).imagePublicId) {
            await deleteLocalFile((existingRecord as any).imagePublicId, "avatars");
        }
        return result;
    }

    public async exists(filters: any) {
        return super.exists(filters);
    }
}
