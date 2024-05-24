/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import openapiTS from 'openapi-typescript';
import { fileURLToPath } from 'url';

const USAGE = `Usage: node generateTypes.mjs path/to/schema/file.yaml [path/to/output/file.js] [--skip-failure]

Flags:
  --skip-failure: ignore failures during types generation

ENV variables (optional):
  OBTYPES_SCHEMA_YAML_PATH - path to schema YAML
  OBTYPES_OUTPUT_PATH - path to output file
`;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const SCHEMA_YAML_PATH = process.argv[2] || process.env.OBTYPES_SCHEMA_YAML_PATH;
const TYPES_PATH =
  process.argv[3] || process.env.OBTYPES_OUTPUT_PATH || path.join(dirname, 'index.ts');

try {
  if (!SCHEMA_YAML_PATH || !TYPES_PATH) {
    console.log(USAGE);
    process.exit(0);
  }

  console.log('Generating types...');

  const contents = await openapiTS(new URL(SCHEMA_YAML_PATH, import.meta.url));
  fs.writeFileSync(TYPES_PATH, contents);

  console.log(`Successfully created ${TYPES_PATH}.`);
} catch (e) {
  console.error('An error has occured:\n\n', e);

  if (!process.argv.some((arg) => arg === '--skip-failure')) {
    process.exit(1);
  }
}
