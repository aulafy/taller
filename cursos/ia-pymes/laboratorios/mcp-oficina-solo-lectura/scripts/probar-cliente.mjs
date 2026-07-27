import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { crearServidor } from "../src/servidor.mjs";

const [clienteTransporte, servidorTransporte] = InMemoryTransport.createLinkedPair();
const servidor = await crearServidor();
const cliente = new Client({ name: "verificador-aulafy", version: "1.0.0" });

await Promise.all([servidor.connect(servidorTransporte), cliente.connect(clienteTransporte)]);

const tools = await cliente.listTools();
const resumen = await cliente.callTool({ name: "resumir_pedidos", arguments: {} });
const pedido = await cliente.callTool({
  name: "consultar_pedido",
  arguments: { id: "PED-DEMO-005" }
});

console.log(
  JSON.stringify(
    {
      herramientas: tools.tools.map(({ name, annotations }) => ({ name, annotations })),
      resumen: resumen.structuredContent,
      consulta: pedido.structuredContent
    },
    null,
    2
  )
);

await Promise.all([cliente.close(), servidor.close()]);
