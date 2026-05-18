import { BaseModule } from '@/core/BaseModule';
import { CommitmentService } from './commitment.service';
import { CommitmentController } from './commitment.controller';
import { CommitmentRoutes } from './commitment.routes';

export class CommitmentModule extends BaseModule {
    public readonly name = 'CommitmentModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: CommitmentService;
    private controller!: CommitmentController;
    private routes!: CommitmentRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new CommitmentService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new CommitmentController(this.service);
        this.routes = new CommitmentRoutes(this.controller);

        this.router.use('/api/commitments', this.routes.getRouter());
    }
}
