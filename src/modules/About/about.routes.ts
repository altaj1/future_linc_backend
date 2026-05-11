import { Router, Request, Response } from 'express';
import { AboutController } from './about.controller';
import { AboutValidation } from './about.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class AboutRoutes {
    private router: Router;
    private controller: AboutController;

    constructor(controller: AboutController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: AboutValidation.create });
        const updateValidator = validateRequest({ 
            params: AboutValidation.params.id, 
            body: AboutValidation.update 
        });
        const idValidator = validateRequest({ params: AboutValidation.params.id });

        const uploadMiddleware = upload.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 }
        ]);

        // Define Routes
        this.router.post('/', uploadMiddleware, createValidator, asyncHandler((req, res) => this.controller.create(req, res)));
        this.router.get('/', asyncHandler((req, res) => this.controller.getAll(req, res)));
        this.router.get('/:id', idValidator, asyncHandler((req, res) => this.controller.getOne(req, res)));
        this.router.patch('/:id', uploadMiddleware, updateValidator, asyncHandler((req, res) => this.controller.update(req, res)));
        this.router.delete('/:id', idValidator, asyncHandler((req, res) => this.controller.delete(req, res)));
    }

    public getRouter(): Router {
        return this.router;
    }
}
