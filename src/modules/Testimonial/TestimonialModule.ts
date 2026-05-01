import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { TestimonialController } from "./testimonial.controller";
import { TestimonialService } from "./testimonial.service";
import { TestimonialRoutes } from "./testimonial.routes";

export class TestimonialModule extends BaseModule {
  public readonly name = "TestimonialModule";
  public readonly version = "1.0.0";
  public readonly dependencies = [];

  private service!: TestimonialService;
  private controller!: TestimonialController;
  private routes!: TestimonialRoutes;

  protected async setupServices(): Promise<void> {
    this.service = new TestimonialService(this.context.prisma);
  }

  protected async setupRoutes(): Promise<void> {
    this.controller = new TestimonialController(this.service);
    this.routes = new TestimonialRoutes(this.controller);
    this.router.use("/api/testimonials", this.routes.getRouter());
  }
}

