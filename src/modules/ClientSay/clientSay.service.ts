import { BaseService } from "@/core/BaseService";
import { PrismaClient } from "@/generated/prisma/client";
import { PaginationOptions } from "@/types/types";
import {
  CreateClientSayInput,
  UpdateClientSayInput,
} from "./clientSay.validation";

export class ClientSayService extends BaseService<
  any,
  CreateClientSayInput,
  UpdateClientSayInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "ClientSay", {
      enableSoftDelete: false,
      enableAuditFields: true,
    });
  }

  protected getModel() {
    // @ts-ignore - The model 'clientSay' might not exist in PrismaClient types yet
    return this.prisma.clientSay;
  }

  // =========================================================================
  // Public API - Exposing BaseService methods
  // Since BaseService methods are protected, we must expose them here
  // =========================================================================

  public async create(data: CreateClientSayInput, userId: any, include?: any) {
    console.log({ object: data, userId });
    return super.create({ ...data, userId }, include);
  }

  public async findMany(
    filters: any = {},
    pagination?: Partial<PaginationOptions>,
    orderBy?: any,
    include?: any,
  ) {
    return super.findMany(filters, pagination, orderBy, {
      user: true,
    });
  }

  public async findById(id: string, include?: any) {
    return super.findById(id, include);
  }

  public async updateById(
    id: string,
    data: UpdateClientSayInput,
    include?: any,
  ) {
    return super.updateById(id, data, include);
  }

  public async deleteById(id: string) {
    return super.deleteById(id);
  }

  public async exists(filters: any) {
    return super.exists(filters);
  }
}
