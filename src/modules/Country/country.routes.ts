import { Router, Request, Response } from 'express';
import { CountryController } from './country.controller';
import { CountryValidation } from './country.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class CountryRoutes {
    private router: Router;
    private controller: CountryController;

    constructor(controller: CountryController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: CountryValidation.create });
        const updateValidator = validateRequest({ 
            params: CountryValidation.params.id, 
            body: CountryValidation.update 
        });
        const idValidator = validateRequest({ params: CountryValidation.params.id });

        // Define Routes
        this.router.post('/', upload.single('image'), createValidator, asyncHandler((req, res) => this.controller.create(req, res)));
        this.router.get('/', asyncHandler((req, res) => this.controller.getAll(req, res)));
        this.router.get('/:id', idValidator, asyncHandler((req, res) => this.controller.getOne(req, res)));
        this.router.patch('/:id', upload.single('image'), updateValidator, asyncHandler((req, res) => this.controller.update(req, res)));
        this.router.delete('/:id', idValidator, asyncHandler((req, res) => this.controller.delete(req, res)));
    }

    public getRouter(): Router {
        return this.router;
    }
}
