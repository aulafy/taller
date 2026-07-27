import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { crearServidor } from "../src/servidor.mjs";

async function conCliente(prueba) {
  const [clienteTransporte, servidorTransporte] = InMemoryTransport.createLinkedPair();
  const servidor = await crearServidor();
  const cliente = new Client({ name: "test-aulafy", version: "1.0.0" });
  await Promise.all([servidor.connect(servidorTransporte), cliente.connect(clienteTransporte)]);
  try {
    await prueba(cliente);
  } finally {
    await Promise.all([cliente.close(), servidor.close()]);
  }
}

test("publica exactamente tres herramientas y todas son de solo lectura", async () => {
  await conCliente(async (cliente) => {
    const { tools } = await cliente.listTools();
    assert.deepEqual(
      tools.map((tool) => tool.name).sort(),
      ["consultar_pedido", "listar_pedidos", "resumir_pedidos"]
    );
    for (const tool of tools) {
      assert.equal(tool.annotations?.readOnlyHint, true);
      assert.equal(tool.annotations?.destructiveHint, false);
      assert.equal(tool.annotations?.openWorldHint, false);
    }
  });
});

test("consulta un pedido conocido sin añadir datos personales", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({
      name: "consultar_pedido",
      arguments: { id: "PED-DEMO-005" }
    });
    assert.equal(resultado.structuredContent.pedido.estado, "incidencia");
    assert.deepEqual(Object.keys(resultado.structuredContent.pedido).sort(), [
      "canal",
      "estado",
      "fecha",
      "id",
      "importe_cents"
    ]);
  });
});

test("un ID inexistente produce una ausencia explícita", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({
      name: "consultar_pedido",
      arguments: { id: "PED-DEMO-999" }
    });
    assert.deepEqual(resultado.structuredContent, { encontrado: false, pedido: null });
  });
});

test("rechaza IDs fuera del contrato antes de ejecutar la herramienta", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({
      name: "consultar_pedido",
      arguments: { id: "../../clientes.csv" }
    });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, /validaci[oó]n|invalid/i);
  });
});

test("el límite máximo impide volcados amplios", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({
      name: "listar_pedidos",
      arguments: { limite: 11 }
    });
    assert.equal(resultado.isError, true);
    assert.match(resultado.content[0].text, /validaci[oó]n|invalid/i);
  });
});

test("filtra por un catálogo cerrado de estados", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({
      name: "listar_pedidos",
      arguments: { estado: "incidencia", limite: 10 }
    });
    assert.equal(resultado.structuredContent.total_coincidencias, 2);
    assert.ok(resultado.structuredContent.pedidos.every((pedido) => pedido.estado === "incidencia"));
  });
});

test("el resumen se reconcilia con los doce registros", async () => {
  await conCliente(async (cliente) => {
    const resultado = await cliente.callTool({ name: "resumir_pedidos", arguments: {} });
    assert.deepEqual(resultado.structuredContent, {
      total_pedidos: 12,
      importe_total_cents: 111590,
      por_estado: {
        pendiente: 3,
        preparacion: 2,
        enviado: 2,
        entregado: 3,
        incidencia: 2
      }
    });
  });
});

test("el proceso stdio arranca sin contaminar el canal del protocolo", async () => {
  const rutaServidor = fileURLToPath(new URL("../src/servidor.mjs", import.meta.url));
  const transporte = new StdioClientTransport({
    command: process.execPath,
    args: [rutaServidor],
    stderr: "pipe"
  });
  const cliente = new Client({ name: "test-stdio-aulafy", version: "1.0.0" });
  await cliente.connect(transporte);
  try {
    const { tools } = await cliente.listTools();
    assert.equal(tools.length, 3);
  } finally {
    await cliente.close();
  }
});
