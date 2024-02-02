import * as fs from 'fs'
import * as os from 'os'

export async function initSettings(repositories: string): Promise<string> {
  if (isEmpty(repositories)) {
    throw new Error('repositories is empty')
  }

  const xml: string = getXml(repositories)

  const m2Directory = `${os.homedir()}/.m2`
  fs.mkdirSync(m2Directory, { recursive: true })
  fs.writeFileSync(`${m2Directory}/settings.xml`, xml)

  return 'done!'
}

function isEmpty(repositories: string | null | undefined): boolean {
  return (
    repositories === null || repositories === undefined || repositories === ''
  )
}

function getXml(repositories: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <mirrors>
        <mirror>
          <id>maven</id>
          <name>maven</name>
          <url>${repositories}</url>
          <mirrorOf>central</mirrorOf>
        </mirror>
      </mirrors>
    </settings>`
}
