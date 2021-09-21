import { asynchronousBodyHandler, Matchers } from '@pact-foundation/pact'
import { JestMessageConsumerOptions, messagePactWith } from 'jest-pact'
import path from 'path'
import { PostgresNotificationRepository } from '../notification-config/postgresNotificationRepository'
import NotificationExecutor from '../notification-execution/notificationExecutor'
import { PipelineSuccessEvent } from './pipelineEvent'
import { TriggerEventHandler } from './triggerEventHandler'
import * as fs from 'fs'

const pactsDir = path.resolve(process.cwd(), '..', 'pacts')

const options: JestMessageConsumerOptions = {
  consumer: 'Notification',
  provider: 'Pipeline',
  dir: pactsDir,
  logDir: path.resolve(process.cwd(), '..', 'pacts', 'logs')

  // TODO the pactfileWriteMode cannot be set due to an open issue in pact-js: https://github.com/pact-foundation/pact-js/issues/414
  // pactfileWriteMode: 'overwrite'
}
// TODO remove this workaround as soon as the pactfileWriteMode can be set to 'overwrite' in JestMessageConsumerOptions
fs.unlinkSync(path.resolve(pactsDir, 'notification-pipeline.json'))

const examplePipelineSuccessEvent: PipelineSuccessEvent = {
  pipelineId: 1,
  pipelineName: 'some pipeline name',
  data: {}
}

jest.mock('../env', () => ({ }))

jest.mock('../notification-config/postgresNotificationRepository', () => {
  return {
    PostgresNotificationRepository: jest.fn().mockImplementation(() => {
      return {
        getForPipeline: jest.fn().mockResolvedValue([])
      }
    })
  }
})
const mockPostgresNotificationRepository = PostgresNotificationRepository as jest.Mock<PostgresNotificationRepository>

jest.mock('../notification-execution/notificationExecutor')
const mockNotificationExecutor = NotificationExecutor as jest.Mock<NotificationExecutor>

messagePactWith(options, (messagePact) => {
  describe('receiving an amqp message', () => {
    it('handles a success event', async () => {
      const triggerEventHandler = new TriggerEventHandler(
        mockPostgresNotificationRepository(),
        mockNotificationExecutor()
      )

      return await messagePact
        .given('any state')
        .expectsToReceive('a success event')
        .withContent(
          Matchers.like(examplePipelineSuccessEvent)
        )
        .verify(asynchronousBodyHandler(async (body) => await triggerEventHandler.handleEvent(body)))
    })
  })
})
