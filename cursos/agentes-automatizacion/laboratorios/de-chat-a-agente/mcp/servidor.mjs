#!/usr/bin/env node
import readline from "node:readline";

import { createProtocolHandler } from "./protocolo.mjs";

const handle = createProtocolHandler();
const lines = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

lines.on("line", (line) => {
  try {
    const response = handle(JSON.parse(line));
    if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
  } catch {
    process.stdout.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "JSON no válido" },
      })}\n`,
    );
  }
});
