#!/usr/bin/env node

const response = await fetch(`http://localhost:1337/api/version`);

if (!response.ok) {
  console.error(`Health check failed: ${response.status}: ${response.statusText}`);
  process.exit(1);
}

const json = await response.json();
if (!json.dashboard || !json.frontend) {
  console.error(`Health check failed: invalid response`, json);
  process.exit(1);
}
console.log(`Health check passed. dashboard: ${json.dashboard}, frontend: ${json.frontend}`);
