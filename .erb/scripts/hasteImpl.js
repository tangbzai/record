'use strict';

const path = require('path');

function getHasteName(filePath) {
  // 如果是 release/app/package.json，则返回不同的名称
  if (filePath.endsWith(path.join('release', 'app', 'package.json'))) {
    return 'release-app-package';
  }

  // 对于其他情况，返回默认的名称
  const name = path.basename(filePath);
  const ext = path.extname(name);
  return ext ? name.slice(0, -ext.length) : name;
}

module.exports = {
  getHasteName,
};
