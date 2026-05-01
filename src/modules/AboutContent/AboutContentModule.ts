import { BaseModule } from '@/core/BaseModule';
import { AboutContentService } from './aboutContent.service';
import { AboutContentController } from './aboutContent.controller';
import { AboutContentRoutes } from './aboutContent.routes';

export class AboutContentModule extends BaseModule {
    public readonly name = 'AboutContentModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: AboutContentService;
    private controller!: AboutContentController;
    private routes!: AboutContentRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new AboutContentService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new AboutContentController(this.service);
        this.routes = new AboutContentRoutes(this.controller);

        this.router.use('/api/about', this.routes.getRouter());
    }
}
