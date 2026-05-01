import { Router, Request, Response } from 'express';
import { AboutContentController } from './aboutContent.controller';
import { AboutContentValidation } from './aboutContent.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';

export class AboutContentRoutes {
    private router: Router;
    private controller: AboutContentController;

    constructor(controller: AboutContentController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: AboutContentValidation.create });
        const updateValidator = validateRequest({ 
            params: AboutContentValidation.params.id, 
            body: AboutContentValidation.update 
        });
        const idValidator = validateRequest({ params: AboutContentValidation.params.id });

        // Define Routes
        this.router.post('/', createValidator, asyncHandler((req, res) => this.controller.create(req, res)));
        this.router.get('/', asyncHandler((req, res) => this.controller.getAll(req, res)));
        this.router.get('/:id', idValidator, asyncHandler((req, res) => this.controller.getOne(req, res)));
        this.router.patch('/:id', updateValidator, asyncHandler((req, res) => this.controller.update(req, res)));
        this.router.delete('/:id', idValidator, asyncHandler((req, res) => this.controller.delete(req, res)));
    }

    public getRouter(): Router {
        return this.router;
    }
}
