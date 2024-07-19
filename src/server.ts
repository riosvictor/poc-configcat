import { getClient, IConfigCatClient, IEvaluationDetails, PollingMode, SettingTypeOf } from 'configcat-node'

let configCatClient: IConfigCatClient;

async function getValue(key: string, attempt: number) {
  console.log(`Attempt ${attempt}`)

  const response = await configCatClient.getValueDetailsAsync(key, undefined); 

  console.log(`value ${response.value}`)

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
    { baseUrl: "http://localhost:8050" }
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