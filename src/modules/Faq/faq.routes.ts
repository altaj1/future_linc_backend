import { Router } from 'express';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class FaqRoutes {
    private router: Router;
    private controller: FaqController;

    constructor(controller: FaqController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: FaqValidation.create });
        const updateValidator = validateRequest({ 
            params: FaqValidation.params.id, 
            body: FaqValidation.update 
        });
        const idValidator = validateRequest({ params: FaqValidation.params.id });
        const updateSectionValidator = validateRequest({ body: FaqValidation.updateSection });

        // Define Routes
        this.router.get('/content', asyncHandler((req, res) => this.controller.getContent(req, res)));
        this.router.get('/section', asyncHandler((req, res) => this.controller.getSection(req, res)));
        this.router.patch('/section', upload.single('image'), updateSectionValidator, asyncHandler((req, res) => this.controller.updateSection(req, res)));

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
