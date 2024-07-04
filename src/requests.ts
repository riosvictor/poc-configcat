import { createAppAuth } from '@octokit/auth-app'
import { request } from '@octokit/request'
import axios from 'axios'
import properties from 'properties'

type TResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
}

async function getGithubConnObj(owner: string) {
  const privateKeyName = process.env[`GITHUB_APP_PRIVATE_KEY_${owner}`]
  if (privateKeyName === undefined) {
    throw new Error(`Não foi possível recuperar o secret ${owner} de GITHUB_APP_PRIVATE_KEY_${owner}`)
  }
  const key = privateKeyName ? privateKeyName.replace(/#/gm, '\n') : ''

  return {
    appId: parseInt(process.env[`GITHUB_APP_ID_${owner}`]),
    privateKey: key,
    clientId: process.env[`GITHUB_APP_CLIENT_ID_${owner}`],
    clientSecret: process.env[`GITHUB_APP_CLIENT_SECRET_${owner}`],
    installationId: parseInt(process.env[`GITHUB_APP_INSTALL_ID_${owner}`])
  }
}

async function getGithubRequest(owner: string) {
  const obj = await getGithubConnObj(owner)

  const appOctokit = createAppAuth(obj)

  return request.defaults({
    request: {
      hook: appOctokit.hook
    }
  })
}

export async function getRepos(org: string): Promise<TResponse<any[]>> {
  const data = []
  const pageSize = 100
  let page = 1
  let hasMore = true
  try {
    const requestWithAuth = await getGithubRequest(org)

    do {
      console.log(`Fetching page ${page} - total ${data.length} - org ${org}`)

      const response = await requestWithAuth('GET /orgs/{org}/repos', {
        org,
        per_page: pageSize,
        page,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      const mappedData = response.data.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        archived: repo.archived,
        disabled: repo.disabled,
      }))

      data.push(...mappedData)

      page++
      hasMore = response.headers.link?.includes('rel="next"') || false
    } while (hasMore)

    return {
      ok: true,
      data,
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}

export async function repoContainsFilePath(request: any = undefined, org: string, repo: string, path: string): Promise<TResponse<any>> {
  let requestWithAuth 
  if (!request) {
    requestWithAuth = await getGithubRequest(org)
  } else {
    requestWithAuth = request
  }

  try {
    const response = await requestWithAuth('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: org,
      repo,
      path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (response.status === 200){
      const fileData = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const lines = fileData.split('\n');
      const propertiesData = properties.parse(lines.join('\n'));
      
      return {
        ok: response.status === 200,
        data: {
          organization: propertiesData['sonar.organization'],
          projectKey: propertiesData['sonar.projectKey'],
          projectName: propertiesData['sonar.projectName'],
        }
      }  
    }

    return {
      ok: response.status === 200,
      data: response.data,
    }
  } catch (error) {
    if ((error as any)?.status === 404) {
      return {
        ok: false,
        error: `File ${path} not found in repo ${repo}`,
      }
    }

    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}



//
const getSonarAuth = async (org: string) => {
  const prefix = 'SONAR_TOKEN_';
  let tokenKey = `${prefix}${org.toUpperCase()}`;

  if (tokenKey === `${prefix}GRUPOBOTICARIO`) {
    tokenKey = `${prefix}GBOTICARIO`;
  }

  const token = process.env[tokenKey];

  if (token === undefined || token === null) {
    throw new Error(`Invalid organization ${org} with token key ${tokenKey}`);
  }

  const buff = Buffer.from(token + ':', 'utf-8');

  return `Basic ${buff.toString('base64')}`;
};

export async function getProjectsByName(organization: string, name: string, options: any = {}) {
  options = { ...{ exact: false }, ...options };

  const params = {
    params: {
      q: name,
      organization
    },
    headers: {
      Authorization: await getSonarAuth(organization)
    }
  };
  try {
    const response = await axios.post(`${process.env.SONAR_URL}/projects/search`, null, params);
    if (options?.exact) {
      return response.data.components.filter((c: any) => c.name === name);
    }
    return response.data.components;
  } catch (err) {
    const error = err as Error;
    error.message = `function getProjectByName - ${error.message} - org ${organization} - name ${name}`;
    throw err;
  }
};

export async function listProjects(organization: string): Promise<TResponse<any[]>> {
  const params = {
    params: {
      organization,
      ps: 500,
      p: 1
    },
    headers: {
      Authorization: await getSonarAuth(organization)
    }
  };
  
  const data = [];
  let hasMore = true;

  try {
    do {
      const response = await axios.get(`${process.env.SONAR_URL}/projects/search`, params);
    
      if (response.data.components.length > 0) {
        data.push(...response.data.components);
      }

      params.params.p++;
      hasMore = response.data.components.length === 500;
    } while (hasMore);
    
    
    return {
      ok: true,
      data
    };
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
};

export async function getProjectByKey(organization: string, key: string) {
  const params = {
    params: {
      organization,
      ps: 500,
      p: 1,
      projects: key
    },
    headers: {
      Authorization: await getSonarAuth(organization)
    }
  };
  try {
    const response = await axios.get(`${process.env.SONAR_URL}/projects/search?organization=${organization}&ps=500&p=1&q=${key}`, params);
    console.log(response.data)
    return response.data.components;
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: (error as any)?.message || 'Unknown error',
    }
  }
}

export async function deleteProject(organization: string, key: string) {
  try {
    const formDataBody = new URLSearchParams();
    formDataBody.append('project', key);
    const requestData = {
      headers: {
        Authorization: await getSonarAuth(organization),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response = await axios.post(`${process.env.SONAR_URL}/projects/delete`, formDataBody, requestData);
    return {
      ok: true,
      data: `Project ${key} deleted`
    };
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      ok: false,
      error: `${(error as any)?.message || 'Unknown error'} - org ${organization} - key ${key}`,
    }
  }
}


export async function getRepo(organization: string, repo: string) {
  try {
    const requestWithAuth = await getGithubRequest(organization)
    const response = await requestWithAuth('GET /repos/{owner}/{repo}', {
      owner: organization,
      repo
    })

    console.log(response)

    return response.data
  } catch (e) {
    const error = e as Error
    error.message = `/repos/{owner}/{repo} - ${error.message}`
    console.error(error)
    throw error
  }
}

export async function addInstallationIds(organization: string, repository: string, installationIds: number[]) {
  if (installationIds.length === 0) {
    return
  }

  console.info('start addInstallationIds function')
  const repoInfo = await getRepo(organization, repository)

  try {
    const requestWithAuth = await getGithubRequest(organization)
    const requests = installationIds.map((installationId) => {
      return requestWithAuth('PUT /user/installations/{installation_id}/repositories/{repository_id}', {
        installation_id: installationId,
        repository_id: repoInfo.id
      })
    })
    await Promise.all(requests)
    console.info('end successfully addInstallationIds function')
  } catch (e) {
    const error = e as Error
    console.error(`end with error addInstallationIds function - ${error?.message}`)
    console.error(error)
    throw error
  }
}

///////

export async function reposContainsSonarFile(org: string, repos: any[]): Promise<TResponse<any[]>> {
  const request = await getGithubRequest(org)
  const sonarFiles = repos.map(async (repo) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const { ok, data } = await repoContainsFilePath(request, org, repo.name, 'sonar-project.properties')
    if (ok) {
      return {
        name: repo.name,
        url: repo.url,
        sonar: data,
      }
    }
    return undefined
  })

  const response = {
    ok: true,
    data: (await Promise.all(sonarFiles)).filter((repo) => repo !== undefined),
  }

  return response
}

export async function reposNotContainsSonarFile(org: string, repos: any[]): Promise<TResponse<any[]>> {
  const request = await getGithubRequest(org)
  const sonarFiles = repos.map(async (repo) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const { ok, data, error } = await repoContainsFilePath(request, org, repo.name, 'sonar-project.properties')
    console.log(error || data)
    if (error?.includes('not found')) {
      return {
        name: repo.name,
        url: repo.url,
        sonar: 'not found',
      }
    }
    if(ok){
      return undefined
    }
    return repo
  })

  const response = {
    ok: true,
    data: (await Promise.all(sonarFiles)).filter((repo) => repo !== undefined),
  }

  return response
}

