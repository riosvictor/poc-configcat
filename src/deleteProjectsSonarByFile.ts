import { DELETE_ARCHIVED_BY_SONAR_FAILED, DELETE_ARCHIVED_BY_SONAR_SUCCESS, REPOS_ARCHIVED_WITH_SONAR_FILE } from "./constants";
import { readLogs, saveLogs } from "./helpers";
import {  deleteProject } from "./requests";

export const run = async () => {
  const archivedRepos = readLogs(REPOS_ARCHIVED_WITH_SONAR_FILE);

  const deleted = [];
  const errors = [];
  for (const repo of archivedRepos) {
    if (!repo.sonar.organization || !repo.sonar.projectKey) {
      errors.push(`Sonar organization or projectKey not found for ${repo.name}`);
      continue;
    }

    const {
      ok,
      data: projects,
      error
    } = await deleteProject(repo.sonar.organization, repo.sonar.projectKey)

    if (ok) {
      deleted.push(projects);
    } else {
      errors.push(error);
    }
  }

  saveLogs(DELETE_ARCHIVED_BY_SONAR_SUCCESS, deleted);
  saveLogs(DELETE_ARCHIVED_BY_SONAR_FAILED, errors);
}