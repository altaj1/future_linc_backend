import { BaseModule } from '@/core/BaseModule';
import { WhyFuturelincService } from './whyFuturelinc.service';
import { WhyFuturelincController } from './whyFuturelinc.controller';
import { WhyFuturelincRoutes } from './whyFuturelinc.routes';

export class WhyFuturelincModule extends BaseModule {
    public readonly name = 'WhyFuturelincModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: WhyFuturelincService;
    private controller!: WhyFuturelincController;
    private routes!: WhyFuturelincRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new WhyFuturelincService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new WhyFuturelincController(this.service);
        this.routes = new WhyFuturelincRoutes(this.controller);

        this.router.use('/api/whyFuturelincs', this.routes.getRouter());
    }
}
