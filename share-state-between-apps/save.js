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

  const cart = ["productA", "productB"];
  await client.state.save(STATE_STORE_NAME, [
    { key: "cart:user123", value: cart },
  ]);
  console.log("Service A: Saved cart for user123:", cart);
}

main();
