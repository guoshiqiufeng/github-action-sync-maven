export interface Dependency {
  groupId: string
  artifactId: string
  version: string
  packaging?: string
  transitive?: boolean
}
