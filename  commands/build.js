const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');

module.exports = async function() {
  // build api
  process.chdir(path.resolve(__dirname, '..', 'api'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');
  await shell.exec('cp -rf src/private ../build/api');
  await shell.exec('mkdir -p .../build/api/src/ && cp -rf src/initialData ../build/api/src/');

  // build integrations
  process.chdir(path.resolve(__dirname, '..', 'integrations'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');

  // build engages
  process.chdir(path.resolve(__dirname, '..', 'engages-email-sender'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');

  // build email verifier
  process.chdir(path.resolve(__dirname, '..', 'email-verifier'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');

  // build logger
  process.chdir(path.resolve(__dirname, '..', 'logger'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');

  // build ui
  process.chdir(path.resolve(__dirname, '..', 'ui'));
  await shell.exec('yarn install');
  await shell.exec('yarn build');

  fs.move(path.resolve(__dirname, '..', 'ui/build'), path.resolve(__dirname, '..', 'build/ui'));
};