import { Router, Request, Response } from 'express';
import { AchievementController } from './achievement.controller';
import { AchievementValidation } from './achievement.validation';
import { validateRequest } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/asyncHandler';

export class AchievementRoutes {
    private router: Router;
    private controller: AchievementController;

    constructor(controller: AchievementController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const createValidator = validateRequest({ body: AchievementValidation.create });
        const updateValidator = validateRequest({ 
            params: AchievementValidation.params.id, 
            body: AchievementValidation.update 
        });
        const idValidator = validateRequest({ params: AchievementValidation.params.id });

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
