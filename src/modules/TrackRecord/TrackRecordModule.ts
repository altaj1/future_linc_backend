import { BaseModule } from '@/core/BaseModule';
import { TrackRecordService } from './trackRecord.service';
import { TrackRecordController } from './trackRecord.controller';
import { TrackRecordRoutes } from './trackRecord.routes';

export class TrackRecordModule extends BaseModule {
    public readonly name = 'TrackRecordModule';
    public readonly version = '1.0.0';
    // Add dependencies if this module relies on others
    public readonly dependencies = []; 

    private service!: TrackRecordService;
    private controller!: TrackRecordController;
    private routes!: TrackRecordRoutes;

    protected async setupServices(): Promise<void> {
        this.service = new TrackRecordService(this.context.prisma);
    }

    protected async setupRoutes(): Promise<void> {
        this.controller = new TrackRecordController(this.service);
        this.routes = new TrackRecordRoutes(this.controller);

        this.router.use('/api/track-records', this.routes.getRouter());
    }
}
