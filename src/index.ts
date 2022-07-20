#! /usr/bin/env node

import { stderr } from 'process';
import fs from 'fs';

type Data = any[] | {[index: string]: any};

// * Exampole:
// * npx json-cli-sorter ./client/src/middleware/locales/lv.json

function sort(data:Data) {
  if (Array.isArray(data)) {
    return data.sort((a, b) => a.localeCompare(b));
  }

  const sorted: Data = {};

  const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));

  keys.forEach((key) => {
    const value = data[key];

    if (typeof value === 'object' && value !== null) {
      sorted[key] = sort(value);
    } else {
      sorted[key] = value;
    }
  });

  return sorted;
}

try {
  const path = process.argv[2];
  if (!path) throw Error('File not specified');

  const rawdata = fs.readFileSync(path, { encoding: 'utf8' });
  const parsedData = JSON.parse(rawdata);
  const sorted = sort(parsedData);

  fs.writeFileSync(path, JSON.stringify(sorted, null, 2));
} catch (e) {
  const suffix = 'Exiting with code 1\n';
  const message = e instanceof Error ? `${e.message}\n${suffix}` : `Something went terribly wrong...\n${suffix}`;
  stderr.write(message);
  process.exit(1);
}
