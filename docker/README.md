```bash
# to start the containers
podman-compose up -d

# create a table in dynamodb
```

Criar um arquivo `docker/options.yaml` com as seguintes informações

```yml
# https://configcat.com/docs/advanced/proxy/proxy-overview/#additional-sdk-options
sdks:
  sdk_config_env:
    key: "key"
    poll_interval: 3600
    webhook_signing_key: "key2"
    default_user_attributes:
      attribute_key: "<attribute_value>"
    log:
      level: "debug"
  sdk_config_env_2:
    key: "key3"
    poll_interval: 3600
    webhook_signing_key: "key4"
    default_user_attributes:
      attribute_key: "<attribute_value>"
    log:
      level: "debug"

http:
  # https://configcat.com/docs/advanced/proxy/endpoints/#webhook
  webhook:
    auth:
      user: "bla"
      password: "blabla"
# https://configcat.com/docs/advanced/proxy/proxy-overview/#cache
cache:
  redis:
    enabled: true
    addresses: ["redis:6379"]
```