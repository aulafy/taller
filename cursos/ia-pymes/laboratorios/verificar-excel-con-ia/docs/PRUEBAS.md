# Pruebas

`npm run verificar` comprueba:

1. las 12 filas y los totales patrón;
2. los tres descuentos omitidos;
3. la última fila ausente del rango propuesto;
4. que superar el caso fácil no valida la fórmula completa;
5. que los datos son sintéticos y no parecen contener secretos.

El libro se inspeccionó también buscando `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?` y `#N/A`: cero coincidencias. Los errores del reto son silenciosos, no errores sintácticos de Excel.
