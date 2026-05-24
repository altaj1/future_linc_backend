import { Router } from "express";
import { StudentsExperienceController } from "./studentsExperience.controller";
import { StudentsExperienceValidation } from "./studentsExperience.validation";
import { validateRequest } from "@/middleware/validation";
import { asyncHandler } from "@/middleware/asyncHandler";
import { upload } from "@/utils/multer";
import { authenticate } from "@/middleware/auth";

export class StudentsExperienceRoutes {
  private router: Router;
  private controller: StudentsExperienceController;

  constructor(controller: StudentsExperienceController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const upsertValidator = validateRequest({
      body: StudentsExperienceValidation.upsert,
    });
    const idValidator = validateRequest({
      params: StudentsExperienceValidation.params.id,
    });

    // Single upsert route — creates if empty, updates if record exists
    this.router.post(
      "/",
      authenticate, // Protect the upsert route
      upload.single("image"),
      upsertValidator,
      asyncHandler((req, res) => this.controller.upsert(req, res)),
    );

    // Get the single StudentsExperience record
    this.router.get(
      "/",
      asyncHandler((req, res) => this.controller.getOne(req, res)),
    );

    // Delete by ID (admin cleanup)
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
