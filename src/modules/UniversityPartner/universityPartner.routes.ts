import { Router } from 'express';
import { UniversityPartnerController } from './universityPartner.controller';
import { UniversityPartnerValidation } from './universityPartner.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class UniversityPartnerRoutes {
    private router: Router;
    private controller: UniversityPartnerController;

    constructor(controller: UniversityPartnerController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: UniversityPartnerValidation.create });
        const updateValidator = validateRequest({ 
            params: UniversityPartnerValidation.params.id, 
            body: UniversityPartnerValidation.update 
        });
        const idValidator = validateRequest({ params: UniversityPartnerValidation.params.id });

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
