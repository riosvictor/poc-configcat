import { ALL_REPOS, REPOS_WITH_COLLABORATORS } from "./constants";
import { readLogs, saveLogs } from "./helpers";
import { getCollaboratorsInRepo } from "./requests";
import * as getReposGithub from './getReposGithub';

export const run = async () => {
  await getReposGithub.run();

  const allRepos = readLogs(ALL_REPOS);

  const reposWithCollaborators = await Promise.all(allRepos.map(async (repo: any) => {
    const { ok, data, error } = await getCollaboratorsInRepo(process.env.GIT_ORG as string, repo.name);
    return {
      ...repo,
      collaborators: data
    }
  }));

  saveLogs(REPOS_WITH_COLLABORATORS, reposWithCollaborators);
}