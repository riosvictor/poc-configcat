import { ALL_REPOS } from "./constants";
import { readLogs, saveLogs } from "./helpers";
import { getRepos } from "./requests";

export const run = async () => {
  let allRepos = readLogs(ALL_REPOS);

  if (!allRepos){
    const { ok, data, error } = await getRepos(process.env.GIT_ORG as string);
    saveLogs(ALL_REPOS, data);
    allRepos = data;
  }
}