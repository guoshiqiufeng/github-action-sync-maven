import * as tc from '@actions/tool-cache'
import * as dependency from '../src/dependency'
import * as exec from '@actions/exec'
import os from 'os'

let cacheMock: jest.SpyInstance
let execMock: jest.SpyInstance
let findMock: jest.SpyInstance
let getXmlMock: jest.SpyInstance

describe('dependency', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    cacheMock = jest.spyOn(tc, 'cacheDir').mockImplementation()
    execMock = jest.spyOn(exec, 'exec').mockImplementation()
    findMock = jest.spyOn(tc, 'find').mockImplementation()
    getXmlMock = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(dependency, 'getXml')
      .mockReturnValue('<your_mocked_xml_content>')
  })

  it('runs the action with valid inputs and caches the directory', async () => {
    const repositories = 'https://repo1.maven.org/maven2/'

    // Mock the find function to return null, simulating that the dependency is not cached
    findMock.mockReturnValue(null)

    await dependency.initDependency(repositories)

    // Check if find function is called with the correct parameters
    expect(findMock).toHaveBeenCalledWith('maven-dependency', repositories)

    dependency.getXml()

    // Check if getXml function is called
    expect(getXmlMock).toHaveBeenCalled()

    // Check if exec.exec is called with the correct parameters
    expect(execMock).toHaveBeenCalledWith('mvn dependency:tree')

    // Check if cacheDir is called with the correct parameters
    const m2Directory = `${os.homedir()}/.m2`
    expect(cacheMock).toHaveBeenCalledWith(
      m2Directory,
      'maven-dependency',
      repositories
    )

    // Ensure that rm -rf pom.xml is not called (since it's commented out in the original code)
    expect(execMock).not.toHaveBeenCalledWith('rm -rf pom.xml')

    // Ensure the expected return value
    expect(await dependency.initDependency(repositories)).toBe('done!')
  })

  it('returns cached directory if already cached', async () => {
    const repositories = 'https://repo1.maven.org/maven2/'

    // Mock the find function to return a cached directory path
    findMock.mockReturnValue('/cached/directory/path')

    const result = await dependency.initDependency(repositories)

    // Check if find function is called with the correct parameters
    expect(findMock).toHaveBeenCalledWith('maven-dependency', repositories)

    // Ensure that other functions are not called when the dependency is already cached
    expect(getXmlMock).not.toHaveBeenCalled()
    expect(execMock).not.toHaveBeenCalled()
    expect(cacheMock).not.toHaveBeenCalled()

    // Ensure the expected return value
    expect(result).toBe('/cached/directory/path')
  })
})
