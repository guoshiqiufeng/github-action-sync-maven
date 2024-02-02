import * as core from '@actions/core'

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

    // Log the current timestamp, wait, then log the new timestamp

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
