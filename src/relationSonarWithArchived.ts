import { ALL_PROJECTS_SONAR, REPOS_ARCHIVED, REPOS_RELATION_NAME_WITH_SONAR_KEY } from "./constants";
import { readLogs, saveLogs } from "./helpers";

const reposArchivedHasSonarProject = (archivedRepos: any, sonarProjects: any) => {
  const sonarProjectsArchived = [];
  for (const sonarProject of sonarProjects) {
    const project = archivedRepos.find((repo: any) => repo.name === sonarProject.key);
    if (project) {
      sonarProjectsArchived.push({
        sonar: sonarProject,
        repo: project,
      });
    }
  }
  return sonarProjectsArchived;
}

export const run = async () => {
  const sonarProjects = readLogs(ALL_PROJECTS_SONAR);
  const archivedRepos = readLogs(REPOS_ARCHIVED);
  const sonarProjectsArchived = reposArchivedHasSonarProject(archivedRepos, sonarProjects);

  saveLogs(REPOS_RELATION_NAME_WITH_SONAR_KEY, sonarProjectsArchived);
}