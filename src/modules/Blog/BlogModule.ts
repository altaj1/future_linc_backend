import { BaseModule } from '@/core/BaseModule';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRoutes } from './blog.routes';

export class BlogModule extends BaseModule {
    public readonly name = 'BlogModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: BlogService;
    private controller!: BlogController;
    private routes!: BlogRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new BlogService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new BlogController(this.service);
        this.routes = new BlogRoutes(this.controller);

        this.router.use('/api/blogs', this.routes.getRouter());
    }
}
