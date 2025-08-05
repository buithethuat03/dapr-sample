import express from "express";
import { DaprClient, CommunicationProtocolEnum } from "@dapr/dapr";

const app = express();
app.use(express.json());

const daprHost = "127.0.0.1";
const daprPort = 3500; // Dapr HTTP port
const STATE_STORE_NAME = "statestore";
const client = new DaprClient({
  daprHost,
  daprPort,
  communicationProtocol: CommunicationProtocolEnum.HTTP,
});

// Save state
app.post("/state/:key", async (req, res) => {
  const key = req.params.key;
  const value = req.body.value;
  await client.state.save(STATE_STORE_NAME, [{ key, value }]);
  res.json({ message: `Saved key=${key}`, value });
});

// Get state
app.get("/state/:key", async (req, res) => {
  const key = req.params.key;
  const value = await client.state.get(STATE_STORE_NAME, key);
  res.json({ key, value: value ?? null });
});

// Delete state
app.delete("/state/:key", async (req, res) => {
  const key = req.params.key;
  await client.state.delete(STATE_STORE_NAME, key);
  res.json({ message: `Deleted key=${key}` });
});

app.listen(3000, () => console.log("Service running on port 3000"));
