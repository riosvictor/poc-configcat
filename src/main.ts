import * as getReposGithub from './getReposGithub';

async function main() {
  await getReposGithub.run();

  // const allGithubRepos = readLogs(ALL_REPOS);
  // const allProjectsSonar = readLogs(ALL_PROJECTS_SONAR);
  // const allReposWithoutSonarFile = readLogs(REPOS_WITHOUT_SONAR_FILE);
  // const allReposWithSonarFile = readLogs(REPOS_WITH_SONAR_FILE);
  // const allArchivedWithSonarFile = readLogs(REPOS_ARCHIVED_WITH_SONAR_FILE);

  // const allReposMerged = allGithubRepos.map((repo: any) => {
  //   const repoWithoutSonarFile = allReposWithoutSonarFile.find((repoWithoutSonar: any) => 
  //       repoWithoutSonar.name === repo.name && repoWithoutSonar.url === repo.url
  //   );
  //   const repoWithSonarFile = allReposWithSonarFile.find((repoWithSonar: any) => 
  //     repoWithSonar.name === repo.name && repoWithSonar.url === repo.url    
  //   );
  //   const repoArchivedWithSonarFile = allArchivedWithSonarFile.find((repoArchivedWithSonar: any) =>
  //     repoArchivedWithSonar.name === repo.name && repoArchivedWithSonar.url === repo.url
  //   );
  //   const sonarFile = repoWithSonarFile?.sonar || repoArchivedWithSonarFile?.sonar || {
  //     organization: 'not found',
  //   }

  //   return {
  //     ...repo,
  //     sonarFile
  //   }
  // });

  // convertToCSV(allReposMerged, 'allReposMerged', [
  //   'name',
  //   'description',
  //   'url',
  //   'archived',
  //   'disabled',
  //   'sonarFile.organization',
  //   'sonarFile.projectKey',
  //   'sonarFile.projectName',
  // ]);
  // convertToCSV(allProjectsSonar, 'allProjectsSonar');
}

main();