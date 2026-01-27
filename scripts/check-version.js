#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const packageVersion = packageJson.version;

const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
const tauriVersion = tauriConfig.version;

if (packageVersion !== tauriVersion) {
  console.error(`Version mismatch: package.json has ${packageVersion}, but tauri.conf.json has ${tauriVersion}`);
  console.error('Please update both files to have the same version.');
  process.exit(1);
}

console.log(`✓ Version check passed: ${packageVersion}`);
process.exit(0);
