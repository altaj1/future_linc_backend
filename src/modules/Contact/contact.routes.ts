import { Router, Request, Response } from "express";
import { ContactController } from "./contact.controller";
import { ContactValidation } from "./contact.validation";
import { validateRequest } from "@/middleware/validation";
import { asyncHandler } from "@/middleware/asyncHandler";
import { upload } from "@/utils/multer";

export class ContactRoutes {
  private router: Router;
  private controller: ContactController;

  constructor(controller: ContactController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const createValidator = validateRequest({ body: ContactValidation.create });
    const updateValidator = validateRequest({
      params: ContactValidation.params.id,
      body: ContactValidation.update,
    });
    const idValidator = validateRequest({
      params: ContactValidation.params.id,
    });

    // Define Routes
    this.router.post(
      "/",
      createValidator,
      asyncHandler((req, res) => this.controller.create(req, res)),
    );
    this.router.get(
      "/",
      asyncHandler((req, res) => this.controller.getAll(req, res)),
    );
    this.router.get(
      "/:id",
      idValidator,
      asyncHandler((req, res) => this.controller.getOne(req, res)),
    );
    this.router.patch(
      "/:id",
      updateValidator,
      asyncHandler((req, res) => this.controller.update(req, res)),
    );
    this.router.delete(
      "/:id",
      idValidator,
      asyncHandler((req, res) => this.controller.delete(req, res)),
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
