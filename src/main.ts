import * as getReposGithub from './getReposGithub';
import * as deleteProjectsSonarByFile from './deleteProjectsSonarByFile';
import * as getProjectsSonar from './getProjectsSonar';
import * as relationSonarWithArchived from './relationSonarWithArchived';
import * as projectsInSonarNotInGithubByName from './projectsInSonarNotInGithubByName';
import * as getReposGithubSonarProps from './getReposGithubSonarProps';
import * as analysisRepos from './analysisRepos';
import { convertToCSV, readLogs } from './helpers';
import { ALL_PROJECTS_SONAR, ALL_REPOS, REPOS_ARCHIVED_WITH_SONAR_FILE, REPOS_WITHOUT_SONAR_FILE, REPOS_WITH_SONAR_FILE } from './constants';

async function main() {
  // await getReposGithub.run();
  // await deleteProjectsSonarByFile.run();
  // await getProjectsSonar.run();
  // await relationSonarWithArchived.run();
  // await projectsInSonarNotInGithubByName.run();
  // await getReposGithubSonarProps.run();
  // await analysisRepos.run();

  const allGithubRepos = readLogs(ALL_REPOS);
  const allProjectsSonar = readLogs(ALL_PROJECTS_SONAR);
  const allReposWithoutSonarFile = readLogs(REPOS_WITHOUT_SONAR_FILE);
  const allReposWithSonarFile = readLogs(REPOS_WITH_SONAR_FILE);
  const allArchivedWithSonarFile = readLogs(REPOS_ARCHIVED_WITH_SONAR_FILE);

  const allReposMerged = allGithubRepos.map((repo: any) => {
    const repoWithoutSonarFile = allReposWithoutSonarFile.find((repoWithoutSonar: any) => 
        repoWithoutSonar.name === repo.name && repoWithoutSonar.url === repo.url
    );
    const repoWithSonarFile = allReposWithSonarFile.find((repoWithSonar: any) => 
      repoWithSonar.name === repo.name && repoWithSonar.url === repo.url    
    );
    const repoArchivedWithSonarFile = allArchivedWithSonarFile.find((repoArchivedWithSonar: any) =>
      repoArchivedWithSonar.name === repo.name && repoArchivedWithSonar.url === repo.url
    );
    const sonarFile = repoWithSonarFile?.sonar || repoArchivedWithSonarFile?.sonar || {
      organization: 'not found',
    }

    return {
      ...repo,
      sonarFile
    }
  });

  convertToCSV(allReposMerged, 'allReposMerged', [
    'name',
    'description',
    'url',
    'archived',
    'disabled',
    'sonarFile.organization',
    'sonarFile.projectKey',
    'sonarFile.projectName',
  ]);
  convertToCSV(allProjectsSonar, 'allProjectsSonar');
}

main();