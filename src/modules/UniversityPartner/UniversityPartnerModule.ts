import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { UniversityPartnerController } from "./universityPartner.controller";
import { UniversityPartnerService } from "./universityPartner.service";
import { UniversityPartnerRoutes } from "./universityPartner.routes";

export class UniversityPartnerModule extends BaseModule {
  public readonly name = "UniversityPartnerModule";
  public readonly version = "1.0.0";
  public readonly dependencies = [];

  private service!: UniversityPartnerService;
  private controller!: UniversityPartnerController;
  private routes!: UniversityPartnerRoutes;

  protected async setupServices(): Promise<void> {
    this.service = new UniversityPartnerService(this.context.prisma);
  }

  protected async setupRoutes(): Promise<void> {
    this.controller = new UniversityPartnerController(this.service);
    this.routes = new UniversityPartnerRoutes(this.controller);
    this.router.use("/api/university-partners", this.routes.getRouter());
  }
}

