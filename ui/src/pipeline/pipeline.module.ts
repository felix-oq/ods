import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Pipeline, { HealthStatus } from './pipeline'
import { PipelineRest } from './pipelineRest'
import { PIPELINE_SERVICE_URL } from '@/env'
import { PipelineTransRest } from './pipelineTransRest'

@Module({ namespaced: true })
export default class PipelineModule extends VuexModule {
  private pipelines: Pipeline[] = []
  private pipelineStates: Map<number, string> = new Map<number, string>()
  private selectedPipeline?: Pipeline = undefined
  private isLoadingPipelines = true
  private isLoadingPipelineStates = true
  private readonly restService = new PipelineRest(PIPELINE_SERVICE_URL)
  private readonly restTransService = new PipelineTransRest(PIPELINE_SERVICE_URL)

  @Mutation
  public setPipelines (pipelines: Pipeline[]): void {
    this.pipelines = pipelines
    this.isLoadingPipelines = false
  }

  @Mutation
  public setPipelineStates (value: Map<number, string>): void {
    this.pipelineStates = value
    this.isLoadingPipelineStates = false
  }

  @Mutation
  public setSelectedPipeline (pipeline: Pipeline): void {
    this.selectedPipeline = pipeline
  }

  @Mutation
  public setIsLoadingPipelines (value: boolean): void {
    this.isLoadingPipelines = value
  }

  @Mutation
  public setIsLoadingPipelineStates (value: boolean): void {
    this.isLoadingPipelines = value
  }

  @Action({ commit: 'setPipelines', rawError: true })
  public async loadPipelines (): Promise<Pipeline[]> {
    this.context.commit('setIsLoadingPipelines', true)

    return await this.restService.getAllPipelines()
  }

  @Action({ commit: 'setPipelineStates', rawError: true })
  private async loadPipelineStates (): Promise<Map<number, string>> {
    this.context.commit('setIsLoadingPipelineStates', true)
    const pipelineStates = new Map<number, string>()
    for (const element of this.pipelines) {
      const transformedData = await this.restTransService.getLatestTransformedData(element.id)

      let healthStatus: string
      if (transformedData.healthStatus === HealthStatus.OK) {
        healthStatus = 'success'
      } else if (transformedData.healthStatus === HealthStatus.WARINING) {
        healthStatus = 'orange'
      } else {
        healthStatus = 'red'
      }

      pipelineStates.set(element.id, healthStatus)
    }

    return pipelineStates
  }

  @Action({ commit: 'setSelectedPipeline', rawError: true })
  public async loadPipelineById (id: number): Promise<Pipeline> {
    return await this.restService.getPipelineById(id)
  }

  @Action({ commit: 'setSelectedPipeline', rawError: true })
  public async loadPipelineByDatasourceId (datasourceId: number): Promise<Pipeline> {
    return await this.restService.getPipelineByDatasourceId(datasourceId)
  }

  @Action({ commit: 'setPipelines', rawError: true })
  public async createPipeline (pipeline: Pipeline): Promise<Pipeline[]> {
    await this.restService.createPipeline(pipeline)
    return await this.restService.getAllPipelines()
  }

  @Action({ commit: 'setPipelines', rawError: true })
  public async updatePipeline (pipeline: Pipeline): Promise<Pipeline[]> {
    await this.restService.updatePipeline(pipeline)
    return await this.restService.getAllPipelines()
  }

  @Action({ commit: 'setPipelines', rawError: true })
  public async deletePipeline (pipelineId: number): Promise<Pipeline[]> {
    await this.restService.deletePipeline(pipelineId)
    return await this.restService.getAllPipelines()
  }
}
