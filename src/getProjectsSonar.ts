import { saveLogs } from "./helpers";
import { listProjects, } from "./requests";

export const run = async () => {
  const {
    ok,
    data,
    error
  } = await listProjects(process.env.SONAR_ORG as string);

  if (ok) {
    saveLogs('projectsSonar', data);
  } else {
    console.error(error);
  }
}