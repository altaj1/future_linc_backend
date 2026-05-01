import { Router } from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { upload } from '@/utils/multer';
import { authenticate, authorize } from '@/middleware/auth';

export class UserRoutes {
    private router: Router;
    private controller: UserController;

    constructor(controller: UserController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: UserValidation.create });
        const updateValidator = validateRequest({ 
            params: UserValidation.params.id, 
            body: UserValidation.update 
        });
        const idValidator = validateRequest({ params: UserValidation.params.id });

        // Define Routes
        this.router.post('/', authenticate, authorize('admin'), upload.single('image'), createValidator, asyncHandler((req, res) => this.controller.create(req, res)));
        this.router.get('/', authenticate, authorize('admin'), asyncHandler((req, res) => this.controller.getAll(req, res)));
        this.router.get('/:id', authenticate, authorize('admin'), idValidator, asyncHandler((req, res) => this.controller.getOne(req, res)));
        this.router.patch('/:id', authenticate, authorize('admin'), upload.single('image'), updateValidator, asyncHandler((req, res) => this.controller.update(req, res)));
        this.router.delete('/:id', authenticate, authorize('admin'), idValidator, asyncHandler((req, res) => this.controller.delete(req, res)));
    }

    public getRouter(): Router {
        return this.router;
    }
}
