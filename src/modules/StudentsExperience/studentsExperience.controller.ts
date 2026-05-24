import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { StudentsExperienceService } from "./studentsExperience.service";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";

export class StudentsExperienceController extends BaseController {
  constructor(private service: StudentsExperienceService) {
    super();
  }

  /**
   * Upsert StudentsExperience — creates a new record if none exists, otherwise updates the existing one.
   * Only one record is ever kept in the database.
   */
  public upsert = async (req: Request, res: Response) => {
    const body = req.validatedBody;
    const imageFile = req.file;
    const userId = this.getUserId(req);
    this.logAction("upsert", req, { body, userId });

    const count = await this.service.getCount();

    if (count === 0) {
      // No record yet — create
      const result = await this.service.create(body, imageFile);
      return this.sendCreatedResponse(
        res,
        result,
        "StudentsExperience created successfully",
      );
    } else {
      // Record exists — fetch and update it
      const existing = await this.service.findFirst();
      const result = await this.service.updateById(
        existing.id,
        body,
        imageFile,
      );
      return this.sendResponse(
        res,
        "StudentsExperience updated successfully",
        HTTPStatusCode.OK,
        result,
      );
    }
  };

  /**
   * Get the single StudentsExperience record
   */
  public getOne = async (req: Request, res: Response) => {
    this.logAction("getOne", req);

    const result = await this.service.findFirst();

    if (!result) {
      return this.sendResponse(
        res,
        "StudentsExperience not found",
        HTTPStatusCode.NOT_FOUND,
      );
    }

    return this.sendResponse(
      res,
      "StudentsExperience retrieved successfully",
      HTTPStatusCode.OK,
      result,
    );
  };

  /**
   * Delete StudentsExperience by ID (admin cleanup)
   */
  public delete = async (req: Request, res: Response) => {
    const { id } = req.validatedParams;
    this.logAction("delete", req, { id });

    const exists = await this.service.exists({ id });
    if (!exists) {
      return this.sendResponse(
        res,
        "StudentsExperience not found",
        HTTPStatusCode.NOT_FOUND,
      );
    }

    await this.service.deleteById(id);

    return this.sendResponse(
      res,
      "StudentsExperience deleted successfully",
      HTTPStatusCode.OK,
    );
  };
}
