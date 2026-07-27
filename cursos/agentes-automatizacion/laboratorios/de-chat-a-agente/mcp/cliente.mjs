import { spawn } from "node:child_process";
import readline from "node:readline";

import { PROTOCOL_VERSION } from "./protocolo.mjs";

export async function runMcpDemo(query) {
  const child = spawn(process.execPath, [
    new URL("./servidor.mjs", import.meta.url).pathname,
  ], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  const pending = new Map();
  let nextId = 1;
  const lines = readline.createInterface({ input: child.stdout });
  lines.on("line", (line) => {
    const message = JSON.parse(line);
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result);
    }
  });

  function request(method, params = {}) {
    const id = nextId++;
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timeout esperando ${method}`));
      }, 3_000);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (cause) => {
          clearTimeout(timer);
          reject(cause);
        },
      });
    });
  }

  try {
    const initialized = await request("initialize", {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "aulafy-cliente-demo", version: "1.0.0" },
    });
    child.stdin.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      })}\n`,
    );
    const listed = await request("tools/list");
    const called = await request("tools/call", {
      name: "buscar_politica",
      arguments: { consulta: query },
    });
    return { initialized, listed, called };
  } finally {
    child.stdin.end();
    await new Promise((resolve) => {
      child.once("exit", resolve);
      setTimeout(() => {
        child.kill("SIGTERM");
        resolve();
      }, 500).unref();
    });
  }
}
