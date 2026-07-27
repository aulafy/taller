# Ollama para una pyme: piloto local, medible y seguro

## 1. Qué problema resuelve

Este laboratorio comprueba si un equipo concreto puede ejecutar una tarea
concreta con Ollama. No promete “IA gratis y privada”: mide tamaño, carga,
latencia y velocidad, obliga a usar datos ficticios y bloquea destinos remotos.

## 2. Qué aprenderás

- verificar que Ollama escucha únicamente en tu ordenador;
- inventariar modelos instalados sin descargar nada;
- ejecutar una FAQ ficticia mediante la API local;
- leer latencia, tokens por segundo y tamaño como observaciones;
- distinguir la licencia MIT de Ollama de la licencia de cada modelo;
- decidir si procede investigar, descartar o ampliar el piloto.

## 3. Requisitos

- Node.js 20 o posterior;
- Ollama iniciado para las pruebas manuales;
- un modelo ya instalado cuya licencia hayas revisado;
- ningún documento, dato de cliente ni clave.

Las pruebas automáticas no requieren Ollama, Internet ni dependencias.

## 4. Inicio rápido seguro

```bash
cd cursos/ia-pymes/laboratorios/ollama-piloto-seguro
npm run verificar
npm run diagnostico
ollama list
OLLAMA_MODEL=gemma3:4b npm run probar
```

Usa el nombre exacto de un modelo de tu lista. El script no lo descarga.

## 5. Cómo leer el resultado

```json
{
  "respuesta": "No consta.",
  "coincide": true,
  "tiempo_total_ms": 2989,
  "tiempo_carga_ms": 2618,
  "tokens_por_segundo": 42.02
}
```

Una ejecución correcta solo demuestra que **esta combinación** de equipo,
versión, modelo y prompt completó una prueba sintética. Para decidir un piloto
real necesitas una batería representativa, revisión humana y criterios de
aceptación.

## 6. Privacidad y red

La API local de Ollama no requiere autenticación. Por eso este laboratorio
acepta únicamente `localhost`, `127.0.0.0/8` o `::1`. No expone el puerto,
no configura `OLLAMA_HOST`, no crea túneles y no ofrece una excepción remota.

El modo local y los modelos cloud son rutas distintas. Antes de usar datos
autorizados, comprueba la configuración, integraciones, logs y política de tu
organización. Si necesitas un servicio compartido, este laboratorio ya no es
la arquitectura adecuada.

## 7. Coste y licencia

- Ollama se publica bajo MIT, pero los pesos descargados tienen su propia licencia.
- El coste incluye ordenador, almacenamiento, electricidad, soporte, copias,
  actualización, revisión y tiempo de espera.
- Un modelo pequeño puede ser suficiente para clasificar o abstenerse; no
  presupongas que sirve para contratos, decisiones o respuestas a clientes.

## 8. Recuperación

La prueba usa `keep_alive: 0`, por lo que solicita descargar el modelo de
memoria después de responder. Para borrar esta práctica, elimina únicamente
esta carpeta. No borres modelos compartidos con otros proyectos.

## 9. Fuentes oficiales

- [API de Ollama](https://docs.ollama.com/api/introduction)
- [Autenticación local](https://docs.ollama.com/api/authentication)
- [Endpoint de generación y métricas](https://docs.ollama.com/api/generate)
- [FAQ: privacidad, cloud y dirección de escucha](https://docs.ollama.com/faq)
- [Soporte de hardware](https://docs.ollama.com/gpu)
- [Repositorio y licencia de Ollama](https://github.com/ollama/ollama)

Código y documentación del laboratorio: licencia MIT.
