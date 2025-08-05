import fetch from "node-fetch";

const daprUrl = "http://localhost:3500/v1.0/state/statestore";

async function main() {
  const key = "user:encrypted";
  const value = { name: "Encrypted Thuật", email: "abc@gmail.com" };

  // 1. Ghi state (Dapr sẽ mã hóa trước khi lưu vào Redis)
  const saveRes = await fetch(daprUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ key, value }]),
  });
  console.log("Saved via Dapr:", key, "status:", saveRes.status);

  // 2. Đọc state (Dapr tự giải mã)
  const readRes = await fetch(`${daprUrl}/${key}`);
  const raw = await readRes.text();
  console.log("\nRaw response from Dapr:", raw);

  try {
    const json = JSON.parse(raw);
    console.log("Parsed JSON:", json);
  } catch {
    console.warn("⚠️ Response is not valid JSON");
  }

  // Giữ app sống để kiểm tra qua curl
  setInterval(() => {}, 1000);
}

main();
