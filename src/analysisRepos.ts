import { ALL_PROJECTS_SONAR, ALL_REPOS, DELETE_ARCHIVED_BY_SONAR_FAILED, DELETE_ARCHIVED_BY_SONAR_SUCCESS, PROJECTS_SONAR_NOT_IN_GITHUB_REPOS, REPOS_ARCHIVED, REPOS_ARCHIVED_WITH_SONAR_FILE, REPOS_NOT_ARCHIVED, REPOS_RELATION_NAME_WITH_SONAR_KEY, REPOS_WITHOUT_SONAR_FILE, REPOS_WITH_SONAR_FILE } from "./constants";
import { readLogs } from "./helpers";

export const run = async () => {
  const allRepos = readLogs(ALL_REPOS);
  const notArchivedRepos = readLogs(REPOS_NOT_ARCHIVED);
  const archivedRepos = readLogs(REPOS_ARCHIVED);
  const archivedWithSonarFile = readLogs(REPOS_ARCHIVED_WITH_SONAR_FILE);
  const reposArchivedWithRelationByNameInSonar = readLogs(REPOS_RELATION_NAME_WITH_SONAR_KEY);
  
  console.table({
    'Total Repos': allRepos.length,
    'Total Not Archived Repos': notArchivedRepos.length,
    'Total Archived Repos': archivedRepos.length,
    'Total Archived Repos with Sonar File': archivedWithSonarFile.length,
    'Total Archived Repos with Relation Name in Sonar': reposArchivedWithRelationByNameInSonar.length,
  })
  //

  const deletedProjectsBySonarFile = readLogs(DELETE_ARCHIVED_BY_SONAR_SUCCESS);
  const errorsDeleteProjectsBySonarFile = readLogs(DELETE_ARCHIVED_BY_SONAR_FAILED);
  const allProjectsSonar = readLogs(ALL_PROJECTS_SONAR);
  const projectsSonarNotInGithubRepos = readLogs(PROJECTS_SONAR_NOT_IN_GITHUB_REPOS);

  console.table({
    'Total Projects Trying to Delete by Sonar File': archivedWithSonarFile.length,
    'Total Deleted Success': deletedProjectsBySonarFile.length,
    'Total Delete Errors': errorsDeleteProjectsBySonarFile.length,
    'Total Projects in Sonar': allProjectsSonar.length,
    'Total Projects in Sonar not in Github Repos By Name As Key': projectsSonarNotInGithubRepos.length,
  })
  //

  const reposWithSonarFile = readLogs(REPOS_WITH_SONAR_FILE);  
  const reposWithoutSonarFile = readLogs(REPOS_WITHOUT_SONAR_FILE);

  console.table({
    'Total Repos with Sonar File': reposWithSonarFile.length,
    'Repos with only "Sonar Project Key"': reposWithSonarFile.filter((repo: any) => repo.sonar && repo.sonar.projectKey && !repo.sonar.projectName).length,
    'Repos with "Sonar Organization"': reposWithSonarFile.filter((repo: any) => repo.sonar && repo.sonar.organization).length,
    'Repos with only "Sonar Project Name"': reposWithSonarFile.filter((repo: any) => repo.sonar && !repo.sonar.projectKey && repo.sonar.projectName).length,
    'Repos with "Project key" and "Project Name"': reposWithSonarFile.filter((repo: any) => repo.sonar && repo.sonar.projectKey && repo.sonar.projectName).length,
    'Repos that "Project Key" is UUID': reposWithSonarFile.filter((repo: any) => repo.sonar && repo.sonar.projectKey && repo.sonar.projectKey.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)).length,
    'Total Repos without Sonar Props': reposWithoutSonarFile.length,
  })
}