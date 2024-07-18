const configcat = require("configcat-node");

async function main() {
  console.log(process.env.CONFIGCAT_KEY);
  
  const configCatClient = configcat.getClient(
    process.env.CONFIGCAT_KEY, 
    configcat.PollingMode.AutoPoll,
    { baseUrl: "http://localhost:8050" }
  );

  const value = await configCatClient.getValueAsync('ativar_opcao_1', undefined); 

  if (value) {
    console.log("New feature is enabled", value);
  } else {
    console.log("New feature is disabled", value); 
  }

  configCatClient.dispose()
}

main()