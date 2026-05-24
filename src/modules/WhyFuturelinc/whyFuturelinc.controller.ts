import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { WhyFuturelincService } from './whyFuturelinc.service';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class WhyFuturelincController extends BaseController {
    constructor(private service: WhyFuturelincService) {
        super();
    }

    /**
     * Upsert WhyFuturelinc — creates a new record if none exists, otherwise updates the existing one.
     * Only one record is ever kept in the database.
     */
    public upsert = async (req: Request, res: Response) => {
        const body = req.validatedBody;
        const imageFile = req.file;
        this.logAction('upsert', req, { body });

        const count = await this.service.getCount();

        if (count === 0) {
            // No record yet — create
            const result = await this.service.create(body, imageFile);
            return this.sendCreatedResponse(res, result, 'WhyFuturelinc created successfully');
        } else {
            // Record exists — fetch and update it
            const existing = await this.service.findFirst();
            const result = await this.service.updateById(existing.id, body, imageFile);
            return this.sendResponse(res, 'WhyFuturelinc updated successfully', HTTPStatusCode.OK, result);
        }
    };

    /**
     * Get the single WhyFuturelinc record
     */
    public getOne = async (req: Request, res: Response) => {
        this.logAction('getOne', req);

        const result = await this.service.findFirst();

        if (!result) {
            return this.sendResponse(res, 'WhyFuturelinc not found', HTTPStatusCode.NOT_FOUND);
        }

        return this.sendResponse(res, 'WhyFuturelinc retrieved successfully', HTTPStatusCode.OK, result);
    };

    /**
     * Delete WhyFuturelinc by ID (admin cleanup)
     */
    public delete = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        this.logAction('delete', req, { id });

        const exists = await this.service.exists({ id });
        if (!exists) {
            return this.sendResponse(res, 'WhyFuturelinc not found', HTTPStatusCode.NOT_FOUND);
        }

        await this.service.deleteById(id);

        return this.sendResponse(res, 'WhyFuturelinc deleted successfully', HTTPStatusCode.OK);
    };
}
