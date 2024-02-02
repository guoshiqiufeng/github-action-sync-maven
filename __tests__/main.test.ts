import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as main from '../src/main'

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let execMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
  })

  it('runs the action with valid inputs', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'repositories':
          return 'your-repo-url'
        case 'dependenciesJson':
          return '[{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki", "version":"0.8.1"}]'
        default:
          return ''
      }
    })

    // Mock the Maven version check
    execMock.mockResolvedValue(0)

    // Mock Maven dependency:get execution
    execMock.mockResolvedValueOnce(0)

    await main.run()

    expect(debugMock).toHaveBeenCalledWith('repositories your-repo-url ')
    expect(debugMock).toHaveBeenCalledWith(
      'dependenciesJson [{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki", "version":"0.8.1"}] '
    )

    expect(execMock).toHaveBeenCalledWith('mvn -version')
  })

  it('handles an error during execution', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'repositories':
          return 'your-repo-url'
        case 'dependenciesJson':
          return '[{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki", "version":"0.8.1"}]'
        default:
          return ''
      }
    })

    // Mock the Maven version check
    execMock.mockResolvedValue(0)

    // Mock an error during Maven dependency:get execution
    execMock.mockRejectedValueOnce(new Error('Failed to get dependency'))

    await main.run()

    expect(debugMock).toHaveBeenCalledWith('repositories your-repo-url ')
    expect(debugMock).toHaveBeenCalledWith(
      'dependenciesJson [{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki", "version":"0.8.1"}] '
    )
    expect(debugMock).toHaveBeenCalledWith('repositories [object Object] ')

    expect(execMock).toHaveBeenCalledWith('mvn -version')
  })
})
