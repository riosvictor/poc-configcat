import { REPOS_WITH_COLLABORATORS, REPOS_WITH_COLLABORATORS_IN_CSV } from "./constants";
import { convertToCSV, readLogs } from "./helpers";

export const run = async () => {
  const allRepos = readLogs(REPOS_WITH_COLLABORATORS);
  const allUsersInRepo: any[] = []

  allRepos.forEach((repo: any) => {
    const collaborators = repo.collaborators?.map((collaborator: any) => {
      return {
        repoName: repo.name,
        repoUrl: repo.url,
        collaboratorName: collaborator.login,
        collaboratorUrl: collaborator.url,
        collaboratorRole: collaborator.role_name,
      }
    });

    if (collaborators) {
      allUsersInRepo.push(...collaborators);
    }
  });

  convertToCSV(allUsersInRepo, REPOS_WITH_COLLABORATORS_IN_CSV);
}