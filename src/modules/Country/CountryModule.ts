import { BaseModule } from '@/core/BaseModule';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryRoutes } from './country.routes';

export class CountryModule extends BaseModule {
    public readonly name = 'CountryModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: CountryService;
    private controller!: CountryController;
    private routes!: CountryRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new CountryService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new CountryController(this.service);
        this.routes = new CountryRoutes(this.controller);

        this.router.use('/api/countries', this.routes.getRouter());
    }
}
