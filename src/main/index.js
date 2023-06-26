// SPDX-FileCopyrightText: 2023 Awayume <dev@awayume.jp>
// SPDX-License-Identifier: APGL-3.0-only

'use strict';

const { Server } = require('./server');
const { addIndent } = require('./utils/strings');

const version = require('../../package.json').version;


process.on('exit', code => {
  console.log('Stopping bitnode-bees...');
  server.close();
  console.info(`bitnode-bees stopped with code ${code}.`);
});


process.on('SIGINT', () => {
  console.warn('Terminated.');
  process.exit(1);
});


process.on('SIGHUP', () => {
  console.warn('Hung up.');
  process.exit(2);
});


// Runner
let server;
try {
  console.log(`Starting bitnode-bees v${version}...`);

  // Start server
  server = new Server(5353);
  server.run();

  console.log('bitnode-bees successfully started.')
} catch(e) {
  console.error('An unexpected error occured:\n' + addIndent(e.stack, 2));
  process.exit(255);
};
