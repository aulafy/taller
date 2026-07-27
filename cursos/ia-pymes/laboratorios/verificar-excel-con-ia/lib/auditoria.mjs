import fs from "node:fs";

export function readSales(path) {
  const [header, ...lines] = fs.readFileSync(path, "utf8").trim().split(/\r?\n/);
  const fields = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const row = Object.fromEntries(fields.map((field, index) => [field, values[index]]));
    for (const key of ["unidades", "precio", "coste_unitario", "descuento"]) {
      row[key] = Number(row[key]);
    }
    return row;
  });
}

export function auditSales(rows) {
  const reviewed = rows.map((row) => {
    const proposedSales = row.unidades * row.precio;
    const verifiedSales = row.unidades * row.precio * (1 - row.descuento);
    const proposedMargin = proposedSales - row.unidades * row.coste_unitario;
    const verifiedMargin = verifiedSales - row.unidades * row.coste_unitario;
    return {
      id: row.id,
      proposedSales,
      verifiedSales,
      proposedMargin,
      verifiedMargin,
      silentError: Math.abs(proposedSales - verifiedSales) >= 0.01,
    };
  });

  const sum = (key) => reviewed.reduce((total, row) => total + row[key], 0);
  const proposedRangeMissingLast = reviewed.slice(0, -1).reduce(
    (total, row) => total + row.proposedSales,
    0,
  );

  return {
    rows: reviewed.length,
    silentErrors: reviewed.filter((row) => row.silentError).length,
    verifiedSales: sum("verifiedSales"),
    verifiedMargin: sum("verifiedMargin"),
    proposedRangeMissingLast,
    totalDifference: proposedRangeMissingLast - sum("verifiedSales"),
    reviewed,
  };
}
