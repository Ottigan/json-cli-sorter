#! /usr/bin/env node

import { stderr } from 'process';

const fs = require('fs');

type Data = any[] | {[index: string]: any};

// * Exampole:
// * node ./json-sorter.js ./client/src/middleware/locales/lv.json
const path = process.argv[2];

if (!path) {
  stderr.write('file not specified\nexiting with code 1\n');
  process.exit(1);
}

const rawdata = fs.readFileSync(path);
const parsedData = JSON.parse(rawdata);

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

if (path && typeof parsedData === 'object') {
  const sorted = sort(parsedData);

  fs.writeFileSync(path, JSON.stringify(sorted, null, 2));
} else {
  process.exit(1);
}
