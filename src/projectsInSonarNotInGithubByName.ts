import { ALL_PROJECTS_SONAR, ALL_REPOS, PROJECTS_SONAR_NOT_IN_GITHUB_REPOS } from "./constants";
import { readLogs, saveLogs } from "./helpers";

const projectsSonarNotInGithubReposByName = (githubRepos: any, sonarProjects: any) => {
  const sonarProjectsNotFoundByName = [];
  
  for (const sonarProject of sonarProjects) {
    const repo = githubRepos.find((repo: any) => repo.name === sonarProject.key);
    if (!repo) {
      sonarProjectsNotFoundByName.push({
        sonar: sonarProject,
        github: repo,
      });
    }
  }

  return sonarProjectsNotFoundByName;
}

export const run = async () => {
  const sonarProjects = readLogs(ALL_PROJECTS_SONAR);
  const githubRepos = readLogs(ALL_REPOS);
  const projectsSonarNotInGithubRepos = projectsSonarNotInGithubReposByName(githubRepos, sonarProjects);

  saveLogs(PROJECTS_SONAR_NOT_IN_GITHUB_REPOS, projectsSonarNotInGithubRepos);
}