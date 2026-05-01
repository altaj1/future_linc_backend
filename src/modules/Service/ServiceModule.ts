import { BaseModule } from '@/core/BaseModule';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRoutes } from './service.routes';

export class ServiceModule extends BaseModule {
    public readonly name = 'ServiceModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: ServiceService;
    private controller!: ServiceController;
    private routes!: ServiceRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new ServiceService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new ServiceController(this.service);
        this.routes = new ServiceRoutes(this.controller);

        this.router.use('/api/services', this.routes.getRouter());
    }
}
