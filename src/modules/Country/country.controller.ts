import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { CountryService } from './country.service';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class CountryController extends BaseController {
    constructor(private service: CountryService) {
        super();
    }

    /**
     * Create a new Country
     */
    public create = async (req: Request, res: Response) => {
        const body = req.validatedBody;
        this.logAction('create', req, { body });
        
        const imageFile = req.file;
        const result = await this.service.create(body, imageFile);
        
        return this.sendCreatedResponse(res, result, 'Country created successfully');
    };

    /**
     * Get all Countrys
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
            'Countrys retrieved successfully', 
            result.data
        );
    };

    /**
     * Get single Country
     */
    public getOne = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        this.logAction('getOne', req, { id });

        const result = await this.service.findById(id);

        if (!result) {
            return this.sendResponse(res, 'Country not found', HTTPStatusCode.NOT_FOUND);
        }

        return this.sendResponse(res, 'Country retrieved successfully', HTTPStatusCode.OK, result);
    };

    /**
     * Update Country
     */
    public update = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        const body = req.validatedBody;
        this.logAction('update', req, { id, body });
        
        const exists = await this.service.exists({ id });
        if (!exists) {
            return this.sendResponse(res, 'Country not found', HTTPStatusCode.NOT_FOUND);
        }

        const imageFile = req.file;
        const result = await this.service.updateById(id, body, imageFile);
        
        return this.sendResponse(res, 'Country updated successfully', HTTPStatusCode.OK, result);
    };

    /**
     * Delete Country
     */
    public delete = async (req: Request, res: Response) => {
        const { id } = req.validatedParams;
        this.logAction('delete', req, { id });
        
        const exists = await this.service.exists({ id });
        if (!exists) {
            return this.sendResponse(res, 'Country not found', HTTPStatusCode.NOT_FOUND);
        }

        await this.service.deleteById(id);
        
        return this.sendResponse(res, 'Country deleted successfully', HTTPStatusCode.OK);
    };
}
