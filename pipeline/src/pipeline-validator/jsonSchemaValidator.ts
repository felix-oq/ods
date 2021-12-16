import {
  HealthStatus,
  PipelineConfig,
} from '../pipeline-config/model/pipelineConfig';
import { PipelineTransformedDataDTO } from '../pipeline-config/model/pipelineTransformedData';

import Validator from './validator';

export default class JsonSchemaValidator implements Validator {
  validate(config: PipelineConfig, data: unknown): PipelineTransformedDataDTO {
    const transformedData: PipelineTransformedDataDTO = {
      pipelineId: config.id,
      healthStatus: HealthStatus.OK,
      data: data as Record<string, unknown>, // Fix @typescript-eslint/ban-types for object type
    };

    return transformedData;
  }
}
