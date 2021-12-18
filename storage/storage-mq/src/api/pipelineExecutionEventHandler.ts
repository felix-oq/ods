import { StorageContentRepository } from '../storage-content/storageContentRepository';

export class PipelineExecutionEventHandler {
  constructor(private readonly contentRepository: StorageContentRepository) {}

  async handleSuccess(
    pipelineExecutedEvent: PipelineExecutedEvent,
  ): Promise<void> {
    await this.contentRepository.saveContent(
      pipelineExecutedEvent.pipelineId.toString(),
      {
        pipelineId: pipelineExecutedEvent.pipelineId,
        timestamp: pipelineExecutedEvent.timestamp ?? new Date(),
        data: pipelineExecutedEvent.results,
      },
    );
  }
}

export interface PipelineExecutedEvent {
  pipelineId: number;
  pipelineName: string;
  results: unknown;
  schema?: Record<string, unknown>;
  timestamp?: Date;
}
