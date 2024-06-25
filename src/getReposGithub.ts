import { ALL_REPOS, REPOS_ARCHIVED, REPOS_ARCHIVED_WITH_SONAR_FILE, REPOS_NOT_ARCHIVED } from "./constants";
import { readLogs, saveLogs } from "./helpers";
import { getRepos, reposContainsSonarFile } from "./requests";

export const run = async () => {
  let allRepos = readLogs(ALL_REPOS);

  if (!allRepos){
    const { ok, data, error } = await getRepos(process.env.GIT_ORG as string);
    saveLogs(ALL_REPOS, data);
    allRepos = data;
  }
  
  const archivedRepos = (allRepos as []).filter((repo: any) => repo.archived);
  const notArchivedRepos = (allRepos as []).filter((repo: any) => !repo.archived);

  saveLogs(REPOS_NOT_ARCHIVED, notArchivedRepos);
  saveLogs(REPOS_ARCHIVED, archivedRepos);

  const { ok, data: archiveSonarProjects, error } = await reposContainsSonarFile(process.env.GIT_ORG as string, archivedRepos);
  
  if (ok) {
    saveLogs(REPOS_ARCHIVED_WITH_SONAR_FILE, archiveSonarProjects);
  } else {
    console.log(error);
  }
}