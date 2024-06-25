import { REPOS_NOT_ARCHIVED, REPOS_WITHOUT_SONAR_FILE, REPOS_WITH_SONAR_FILE } from "./constants";
import { readLogs, saveLogs } from "./helpers";
import { reposContainsSonarFile, reposNotContainsSonarFile } from "./requests";

async function reposWithSonarFile() {
  let alreadyProcessRepos = readLogs(REPOS_WITH_SONAR_FILE);

  if (!alreadyProcessRepos) {
    alreadyProcessRepos = readLogs(REPOS_NOT_ARCHIVED);
  }

  const filteredRepos = alreadyProcessRepos.filter((repo: any) => !repo.sonar);
  const reposWithSonar = alreadyProcessRepos.filter((repo: any) => repo.sonar);
  const { ok, data: repoSonarFile, error } = await reposContainsSonarFile(process.env.GIT_ORG as string, filteredRepos);
  
  if (ok) {
    saveLogs(REPOS_WITH_SONAR_FILE, [...reposWithSonar, ...repoSonarFile as []]);
  }
}

async function reposWithoutSonarFile() {
  let alreadyProcessRepos = readLogs(REPOS_WITHOUT_SONAR_FILE);

  if (!alreadyProcessRepos) {
    alreadyProcessRepos = readLogs(REPOS_NOT_ARCHIVED);
  }

  const filteredRepos = alreadyProcessRepos.filter((repo: any) => !repo.sonar);
  const reposWithSonar = alreadyProcessRepos.filter((repo: any) => repo.sonar);
  const { ok, data: repoSonarFile, error } = await reposNotContainsSonarFile(process.env.GIT_ORG as string, filteredRepos);
  
  if (ok) {
    saveLogs(REPOS_WITHOUT_SONAR_FILE, [...reposWithSonar, ...repoSonarFile as []]);
  }
}

export const run = async () => {
  await reposWithSonarFile();
  await reposWithoutSonarFile();
}