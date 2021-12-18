import { validators } from '@jvalue/node-dry-basics';

export interface PipelineSuccessEvent {
  pipelineId: number;
  pipelineName: string;
  data: Record<string, unknown>;
  schema?: Record<string, string>;
}

/**
 * Checks if this event is a valid pipeline success event,
 * by checking if all field variables exist and are set.
 *
 * @returns     true, if param event is a PipelineSuccessEvent, else false
 */
export function isValidPipelineSuccessEvent(
  event: unknown,
): event is PipelineSuccessEvent {
  if (!validators.isObject(event)) {
    return false;
  }
  if (
    validators.hasProperty(event, 'schema') &&
    validators.isObject(event.schema)
  ) {
    for (const [, value] of Object.entries(event.schema)) {
      if (!validators.isString(value)) {
        return false;
      }
    }
  }
  return (
    validators.hasProperty(event, 'pipelineId') &&
    validators.hasProperty(event, 'pipelineName') &&
    validators.hasProperty(event, 'data')
  );
}
