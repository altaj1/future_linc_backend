import { Router } from 'express';
import { WhyFuturelincController } from './whyFuturelinc.controller';
import { WhyFuturelincValidation } from './whyFuturelinc.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class WhyFuturelincRoutes {
    private router: Router;
    private controller: WhyFuturelincController;

    constructor(controller: WhyFuturelincController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const upsertValidator = validateRequest({ body: WhyFuturelincValidation.upsert });
        const idValidator = validateRequest({ params: WhyFuturelincValidation.params.id });

        // Single upsert route — creates if empty, updates if record exists
        this.router.post(
            '/',
            upload.single('image'),
            upsertValidator,
            asyncHandler((req, res) => this.controller.upsert(req, res))
        );

        // Get the single WhyFuturelinc record
        this.router.get(
            '/',
            asyncHandler((req, res) => this.controller.getOne(req, res))
        );

        // Delete by ID (admin cleanup)
        this.router.delete(
            '/:id',
            idValidator,
            asyncHandler((req, res) => this.controller.delete(req, res))
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
