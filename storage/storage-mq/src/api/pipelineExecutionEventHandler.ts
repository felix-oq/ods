import { StorageContentRepository } from '../storage-content/storageContentRepository';

export class PipelineExecutionEventHandler {
  constructor(private readonly contentRepository: StorageContentRepository) {}

  async handleSuccess(
    pipelineExecutedEvent: PipelineExecutedEvent,
  ): Promise<void> {
    if (typeof pipelineExecutedEvent.data !== 'string') {
      throw new Error('Received data with invalid type');
    }
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
  data: string;
  schema?: Record<string, unknown>;
  timestamp?: Date;
}
