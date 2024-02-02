# Github Action Sync Maven

[![CodeQL](https://github.com/guoshiqiufeng/github-action-async-maven/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/guoshiqiufeng/github-action-async-maven/actions/workflows/codeql-analysis.yml)
[![Check Transpiled JavaScript](https://github.com/guoshiqiufeng/github-action-async-maven/actions/workflows/check-dist.yml/badge.svg)](https://github.com/guoshiqiufeng/github-action-async-maven/actions/workflows/check-dist.yml)

This Action is used to synchronize dependencies to maven repositories. 

## Parameters

- `repositories` 
  - **Required**. The maven repositories to synchronize to.
  - default value: `https://repo1.maven.org/maven2/`
- `dependenciesJson`
  - **Required**. The dependencies to synchronize. Is a configured json array.
  - json format
    - groupId
    - artifactId
    - version

## Use the Action

```yaml
   name: "Sync Maven"
   on:
     push:
       branches:
         - main
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Set up Maven
           uses: stCarolas/setup-maven@v4.5
           with:
             maven-version: 3.9.5
         - uses: guoshiqiufeng/github-action-sync-maven@v1
           with:
             repositories: 'https://maven.aliyun.com/repository/public'
             dependenciesJson: '[{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki", "version":"0.8.1"},{"groupId":"io.github.guoshiqiufeng", "artifactId":"loki-spring-boot-starter", "version":"0.8.1"}]'

```


