#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const fs = require('fs');
// * Exampole:
// * node ./json-sorter.js ./client/src/middleware/locales/lv.json
const path = process.argv[2];
if (!path) {
    process_1.stderr.write('file not specified\nexiting with code 1\n');
    process.exit(1);
}
const rawdata = fs.readFileSync(path);
const parsedData = JSON.parse(rawdata);
function sort(data) {
    if (Array.isArray(data)) {
        return data.sort((a, b) => a.localeCompare(b));
    }
    const sorted = {};
    const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));
    keys.forEach((key) => {
        const value = data[key];
        if (typeof value === 'object' && value !== null) {
            sorted[key] = sort(value);
        }
        else {
            sorted[key] = value;
        }
    });
    return sorted;
}
if (path && typeof parsedData === 'object') {
    const sorted = sort(parsedData);
    fs.writeFileSync(path, JSON.stringify(sorted, null, 2));
}
else {
    process.exit(1);
}
//# sourceMappingURL=index.js.map