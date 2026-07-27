export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("CSV con comillas sin cerrar.");
  if (field !== "" || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  const [headers, ...data] = rows;
  if (!headers) return [];
  if (data.some((values) => values.length !== headers.length)) throw new Error("Todas las filas deben tener el mismo número de campos.");
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]])));
}

export function toCsv(rows, columns) {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return [columns.map(quote).join(","), ...rows.map((row) => columns.map((column) => quote(row[column])).join(","))].join("\r\n") + "\r\n";
}
