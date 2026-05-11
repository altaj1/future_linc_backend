import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { AboutService } from './about.service';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class AboutController extends BaseController {
    constructor(private service: AboutService) {
        super();
    }

    /**
     * Create a new About
     */
    public create = async (req: Request, res: Response) => {
        const body = req.validatedBody;
        this.logAction('create', req, { body });
        
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const result = await this.service.create(body, files);
        
        return this.sendCreatedResponse(res, result, 'About created successfully');
    };

    /**
     * Get all Abouts
     */
    public getAll = async (req: Request, res: Response) => {
        const pagination = this.extractPaginationParams(req);
        this.logAction('getAll', req, { pagination });

        const result = await this.service.findMany({}, pagination);

        return this.sendPaginatedResponse(
            res, 
            {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasNext: result.hasNext,
                hasPrevious: result.hasPrevious
            }, 
            'Abouts retrieved successfully', 
            result.data
        );
    };

    /**
     * Get single About
     */
    public getOne = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        this.logAction('getOne', req, { id });

        const result = await this.service.findById(id);

        if (!result) {
            return this.sendResponse(res, 'About not found', HTTPStatusCode.NOT_FOUND);
        }

        return this.sendResponse(res, 'About retrieved successfully', HTTPStatusCode.OK, result);
    };

    /**
     * Update About
     */
    public update = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        const body = req.validatedBody;
        this.logAction('update', req, { id, body });
        
        const exists = await this.service.exists({ id });
        if (!exists) {
            return this.sendResponse(res, 'About not found', HTTPStatusCode.NOT_FOUND);
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const result = await this.service.updateById(id, body, files);
        
        return this.sendResponse(res, 'About updated successfully', HTTPStatusCode.OK, result);
    };

    /**
     * Delete About
     */
    public delete = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        this.logAction('delete', req, { id });
        
        const exists = await this.service.exists({ id });
        if (!exists) {
            return this.sendResponse(res, 'About not found', HTTPStatusCode.NOT_FOUND);
        }

        await this.service.deleteById(id);
        
        return this.sendResponse(res, 'About deleted successfully', HTTPStatusCode.OK);
    };
}
