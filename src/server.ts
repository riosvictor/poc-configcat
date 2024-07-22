import { getClient, IConfigCatClient, PollingMode } from 'configcat-node'

// const proxyBaseUrl = 'http://localhost:8050';
const proxyBaseUrl = 'https://2c8b-189-86-220-160.ngrok-free.app';
let configCatClient: IConfigCatClient;

async function getValue(key: string, attempt: number) {
  console.log(`Attempt ${attempt}`)

  const response = await configCatClient.getValueDetailsAsync(key, undefined);
  const sdk = (process.env.CONFIGCAT_KEY_PROXY as string).split("/")[1]
  const response2 = await fetch(`${proxyBaseUrl}/api/${sdk}/eval`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.CONFIGCAT_X_API_KEY as string
    },
    body: JSON.stringify({ 
      key,
      user: {
        Identifier: "<user-id>",
      }
    })
  }).then(res => res.json())

  console.log(`value ${response.value}`)
  console.log(`value2 ${(response2 as any)?.value}`)

  await wait(10000)

  if (attempt % 2 === 0) {
    await configCatClient.forceRefreshAsync()
    console.log("Forcing refresh")
  }
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


async function main() {
  configCatClient = getClient(
    process.env.CONFIGCAT_KEY_PROXY as string, 
    PollingMode.AutoPoll,
    { baseUrl: proxyBaseUrl }
  );

  // configCatClient = getClient(
  //   process.env.CONFIGCAT_KEY as string, 
  //   PollingMode.AutoPoll,
  // );
  
  let attempt = 1
  while (attempt <= 10) {
    await getValue("ativar_opcao_1", attempt)
    attempt++
  }
}

main()