
import { Client } from 'pg';
import fs from 'fs';

const client = new Client({
  user: 'elitebook',
  host: 'localhost',
  database: 'nextdeploy_dev',
  password: '50307813117',
  port: 5432,
});

await client.connect();

// Fetch tables and columns
const tablesRes = await client.query(`
  SELECT table_name, column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position;
`);

const relationshipsRes = await client.query(`
  SELECT
    conrelid::regclass AS source_table,
    a.attname AS source_column,
    confrelid::regclass AS target_table,
    af.attname AS target_column
  FROM
    pg_constraint
    JOIN pg_attribute a ON a.attnum = ANY (conkey) AND a.attrelid = conrelid
    JOIN pg_attribute af ON af.attnum = ANY (confkey) AND af.attrelid = confrelid
  WHERE
    contype = 'f';
`);

await client.end();

// Group columns by table
const tables = {};
tablesRes.rows.forEach(({ table_name, column_name, data_type }) => {
  if (!tables[table_name]) tables[table_name] = [];
  tables[table_name].push(`${column_name} ${data_type}`);
});

// Build Mermaid syntax
let mermaid = 'erDiagram\n';

for (const [table, cols] of Object.entries(tables)) {
  mermaid += `  ${table} {\n`;
  cols.forEach(col => mermaid += `    ${col}\n`);
  mermaid += `  }\n`;
}

relationshipsRes.rows.forEach(({ source_table, source_column, target_table, target_column }) => {
  mermaid += `  ${source_table} }o--|| ${target_table} : "${source_column} to ${target_column}"\n`;
});

// Save to file
fs.writeFileSync('./erd.mmd', mermaid);
console.log('✅ ERD Mermaid code generated in erd.mmd');
