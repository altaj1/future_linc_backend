import { BaseModule } from '@/core/BaseModule';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { AchievementRoutes } from './achievement.routes';

export class AchievementModule extends BaseModule {
    public readonly name = 'AchievementModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: AchievementService;
    private controller!: AchievementController;
    private routes!: AchievementRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new AchievementService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new AchievementController(this.service);
        this.routes = new AchievementRoutes(this.controller);

        this.router.use('/api/achievements', this.routes.getRouter());
    }
}
