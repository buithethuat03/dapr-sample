import { DaprClient, CommunicationProtocolEnum } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT || "3500";
const STATE_STORE_NAME = "statestore";

async function main() {
  const client = new DaprClient({
    daprHost,
    daprPort,
    communicationProtocol: CommunicationProtocolEnum.HTTP,
  });

  const value = await client.state.get(STATE_STORE_NAME, "cart:user123");
  console.log("Service B: Read cart for user123:", value);
}

main();
