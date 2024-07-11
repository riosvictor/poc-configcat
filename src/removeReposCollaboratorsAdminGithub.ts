import { COLLABORATOR_REMOVED_REPO, COLLABORATOR_REMOVED_REPO_ERRORS, REPOS_WITH_COLLABORATORS_ADMIN_IN_CSV } from "./constants";
import { readCsvToJson, saveLogs } from "./helpers";
import { removeCollaboratorsFromRepo } from "./requests";

export const run = async () => {
  // repoName | collaboratorName
  const reposWithCollaborators = readCsvToJson(REPOS_WITH_COLLABORATORS_ADMIN_IN_CSV);
  const removed: any[] = []
  const errors: any[] = []

  reposWithCollaborators?.forEach(async (repo: any) => {
    // const { ok, error } = await removeCollaboratorsFromRepo(process.env.GIT_ORG as string, repo.repoName, repo.collaboratorName)
    //if (ok) {
      removed.push(repo);
    // } else {
    //   errors.push({ ...repo, error });
    // }
  });  

  saveLogs(COLLABORATOR_REMOVED_REPO, removed);
  saveLogs(COLLABORATOR_REMOVED_REPO_ERRORS, errors);
}