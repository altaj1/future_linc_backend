import { BaseModule } from '@/core/BaseModule';
import { ClientSayService } from './clientSay.service';
import { ClientSayController } from './clientSay.controller';
import { ClientSayRoutes } from './clientSay.routes';

export class ClientSayModule extends BaseModule {
    public readonly name = 'ClientSayModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: ClientSayService;
    private controller!: ClientSayController;
    private routes!: ClientSayRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new ClientSayService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new ClientSayController(this.service);
        this.routes = new ClientSayRoutes(this.controller);

        this.router.use('/api/clientSays', this.routes.getRouter());
    }
}
