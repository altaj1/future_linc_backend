import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRoutes } from "./user.routes";

export class UserModule extends BaseModule {
  public readonly name = "UserModule";
  public readonly version = "1.0.0";
  public readonly dependencies = [];

  private service!: UserService;
  private controller!: UserController;
  private routes!: UserRoutes;

  protected async setupServices(): Promise<void> {
    this.service = new UserService(this.context.prisma);
  }

  protected async setupRoutes(): Promise<void> {
    this.controller = new UserController(this.service);
    this.routes = new UserRoutes(this.controller);
    this.router.use("/api/users", this.routes.getRouter());
  }
}
