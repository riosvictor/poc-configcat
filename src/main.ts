import * as getReposWithCollaborators from './getReposCollaboratorsGithub';
import * as reposWithCollaboratorsInCsv from './reposWithCollaboratorsInCsv';
import * as removeReposCollaboratorsAdmin from './removeReposCollaboratorsAdminGithub';
import * as getReposGithub from './getReposGithub';

async function main() {
  await getReposGithub.run();
  // await getReposWithCollaborators.run();
  // await reposWithCollaboratorsInCsv.run();

  // await removeReposCollaboratorsAdmin.run();
}

main();