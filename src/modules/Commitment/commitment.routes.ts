import { Router, Request, Response } from 'express';
import { CommitmentController } from './commitment.controller';
import { CommitmentValidation } from './commitment.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';

export class CommitmentRoutes {
    private router: Router;
    private controller: CommitmentController;

    constructor(controller: CommitmentController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: CommitmentValidation.create });
        const updateValidator = validateRequest({ 
            params: CommitmentValidation.params.id, 
            body: CommitmentValidation.update 
        });
        const idValidator = validateRequest({ params: CommitmentValidation.params.id });

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
