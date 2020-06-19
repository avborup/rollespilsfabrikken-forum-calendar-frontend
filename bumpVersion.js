const fs = require('fs');

// The version will simply be the current timestamp in minutes.
const generateVersion = () => {
  const now = new Date();
  const timestamp = now.getTime();
  const minutes = Math.floor(timestamp / 1000 / 60);

  return `v${minutes}`;
};

const writeVersion = vStr => {
  const path = './src/assets/VERSION.txt';

  fs.writeFile(path, vStr, 'utf8', (err) => {
    if (err) console.error('Failed to bump version');
    else console.log(`Bumped version to ${vStr}`);
  });
};

const version = generateVersion();
writeVersion(version);
