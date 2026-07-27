# Brief

## Problema

Una pyme puede instalar Ollama creyendo que “local” significa gratis, privado y
suficientemente rápido. El laboratorio debe sustituir esa promesa por una
prueba medible sobre datos ficticios.

## Contrato

- La API solo puede apuntar a loopback.
- La prueba nunca descarga modelos ni usa una API cloud.
- El alumno elige un modelo ya instalado después de revisar su licencia.
- La salida conserva tamaño, latencia y velocidad observados.
- Una respuesta correcta se presenta como una observación, no como un benchmark.
- Los tests funcionan sin Ollama mediante un servidor local simulado.

## Fuera de alcance

- publicar Ollama en una red, túnel o Internet;
- autenticar un servicio compartido;
- procesar documentos reales de una empresa;
- recomendar un modelo universal o prometer ahorro;
- certificar RGPD, seguridad o calidad de producción.
