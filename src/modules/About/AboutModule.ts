import { BaseModule } from "@/core/BaseModule";
import { AboutService } from "./about.service";
import { AboutController } from "./about.controller";
import { AboutRoutes } from "./about.routes";

export class AboutModule extends BaseModule {
  public readonly name = "AboutModule";
  public readonly version = "1.0.0";
  // Add dependencies if this module relies on others
  public readonly dependencies = [];

  private service!: AboutService;
  private controller!: AboutController;
  private routes!: AboutRoutes;

  protected async setupServices(): Promise<void> {
    this.service = new AboutService(this.context.prisma);
  }

  protected async setupRoutes(): Promise<void> {
    this.controller = new AboutController(this.service);
    this.routes = new AboutRoutes(this.controller);

    this.router.use("/api/about", this.routes.getRouter());
  }
}
