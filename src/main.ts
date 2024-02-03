import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { Dependency } from './type'
import { initSettings } from './setting'
import { initDependency } from './dependency'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const repositories: string = core.getInput('repositories')
    const dependenciesJson: string = core.getInput('dependenciesJson')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`repositories ${repositories} `)
    core.debug(`dependenciesJson ${dependenciesJson} `)

    // 解析 JSON 字符串
    const jsonArray: {
      groupId: string
      artifactId: string
      version: string
      packaging?: string
      transitive?: boolean
    }[] = JSON.parse(dependenciesJson)

    // 将 JSON 对象数组转换为 TypeScript 对象数组
    const dependencies: Dependency[] = jsonArray.map(item => ({
      groupId: item.groupId,
      artifactId: item.artifactId,
      version: item.version,
      packaging: item.packaging ? item.packaging : 'jar',
      transitive: item.transitive != null ? item.transitive : true
    }))
    core.debug(`repositories ${dependencies} `)
    const check = await exec.exec('mvn -version')
    core.debug(`mvn check ${check} `)
    // init dependency
    await initDependency(repositories)
    // init settings
    await initSettings(repositories)
    // await exec.exec('cat pom.xml')
    // await exec.exec('mvn dependency:list-repositories')
    for (const dependency of dependencies) {
      try {
        const result = await exec.exec('mvn dependency:get', [
          // `-DremoteRepositories=central::default::${repositories}`,
          `-DgroupId=${dependency.groupId}`,
          `-DartifactId=${dependency.artifactId}`,
          `-Dversion=${dependency.version}`,
          `-Dpackaging=${dependency.packaging}`,
          `-Dtransitive=${dependency.transitive}`
        ])
        core.debug(`mvn dependency:get ${result} `)
      } catch (error) {
        core.error(`mvn dependency:get error ${error} `)
        core.setFailed(
          `Failed to get dependency: ${dependency.groupId}:${dependency.artifactId}:${dependency.version}`
        )
      }
    }

    core.setOutput('time', check)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
