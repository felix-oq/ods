export default interface Pipeline {
  id: number;
  datasourceId: number;
  metadata: PipelineMetaData;
  transformation: TransformationConfig;
  schema?: Record<string, unknown>;
}

export interface PipelineDTO {
  id: number;
  metadata: PipelineMetaData;
  transformation: TransformationConfig;
  schema?: Record<string, unknown>;
}

export function toPipelineDTO(pipeline: Pipeline): PipelineDTO {
  return {
    id: pipeline.id,
    metadata: pipeline.metadata,
    transformation: pipeline.transformation,
    schema: pipeline.schema,
  };
}

export interface PipelineMetaData {
  displayName: string;
  description: string;
  author: string;
  license: string;
}

export interface TransformationConfig {
  func: string;
}

export interface TransformedDataMetaData {
  id: number;
  healthStatus: HealthStatus;
}

export enum HealthStatus {
  OK = 'OK',
  WARINING = 'WARNING',
  FAILED = 'FAILED',
}
