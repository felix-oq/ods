import { StorageContentRepository } from '../storage-content/storageContentRepository';

export class PipelineExecutionEventHandler {
  constructor(private readonly contentRepository: StorageContentRepository) {}

  async handleSuccess(
    pipelineExecutedEvent: PipelineExecutedEvent,
  ): Promise<void> {
    console.log(
      `Received a pipeline executed event with description "${pipelineExecutedEvent.description}"`,
    );
    await this.contentRepository.saveContent(
      pipelineExecutedEvent.pipelineId.toString(),
      {
        pipelineId: pipelineExecutedEvent.pipelineId,
        timestamp: pipelineExecutedEvent.timestamp ?? new Date(),
        data: pipelineExecutedEvent.data,
      },
    );
  }
}

export interface PipelineExecutedEvent {
  pipelineId: number;
  pipelineName: string;
  data: unknown;
  description: string;
  schema?: Record<string, unknown>;
  timestamp?: Date;
}
