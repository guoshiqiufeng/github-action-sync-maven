import * as fs from 'fs'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import os from 'os'

export async function initDependency(repositories: string): Promise<string> {
  const value = tc.find('maven-dependency', repositories)
  if (value) {
    return value
  }
  const m2Directory = `${os.homedir()}/.m2`
  const xml: string = getXml(m2Directory)
  fs.writeFileSync(`pom.xml`, xml)
  await exec.exec('mvn dependency:tree')
  await tc.cacheDir(m2Directory, 'maven-dependency', repositories)
  //await exec.exec('rm -rf pom.xml')
  return 'done!'
}

function getXml(m2Directory: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <artifactId>github-action-sync-maven</artifactId>
    <groupId>io.github.guoshiqiufeng</groupId>
    <version>1.0.0</version>
    <repositories>
        <repository>
            <id>local-repo</id>
            <url>file://${m2Directory}/repository</url>
        </repository>
    </repositories>
</project>`
}
