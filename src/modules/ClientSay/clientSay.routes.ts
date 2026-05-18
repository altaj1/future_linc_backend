import { Router, Request, Response } from "express";
import { ClientSayController } from "./clientSay.controller";
import { ClientSayValidation } from "./clientSay.validation";
import { validateRequest } from "@/middleware/validation";
import { asyncHandler } from "@/middleware/asyncHandler";
import { authenticate, authorize } from "@/middleware/auth";

export class ClientSayRoutes {
  private router: Router;
  private controller: ClientSayController;

  constructor(controller: ClientSayController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const createValidator = validateRequest({
      body: ClientSayValidation.create,
    });
    const updateValidator = validateRequest({
      params: ClientSayValidation.params.id,
      body: ClientSayValidation.update,
    });
    const idValidator = validateRequest({
      params: ClientSayValidation.params.id,
    });

    // Define Routes
    this.router.post(
      "/",
      authenticate,
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
