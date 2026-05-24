import { BaseModule } from '@/core/BaseModule';
import { StudentsExperienceService } from './studentsExperience.service';
import { StudentsExperienceController } from './studentsExperience.controller';
import { StudentsExperienceRoutes } from './studentsExperience.routes';

export class StudentsExperienceModule extends BaseModule {
    public readonly name = 'StudentsExperienceModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: StudentsExperienceService;
    private controller!: StudentsExperienceController;
    private routes!: StudentsExperienceRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new StudentsExperienceService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new StudentsExperienceController(this.service);
        this.routes = new StudentsExperienceRoutes(this.controller);

        this.router.use('/api/studentsExperiences', this.routes.getRouter());
    }
}
