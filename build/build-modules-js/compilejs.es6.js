const { stat } = require('fs-extra');
const { sep } = require('path');
const recursive = require('recursive-readdir');
const { handleES5File } = require('./javascript/handle-es5.es6.js');
const { handleESMFile } = require('./javascript/compile-es6.es6.js');
const { handleWCFile } = require('./javascript/compile-w-c.es6.js');

const RootPath = process.cwd();

/**
 * Method that will crawl the media_source folder and
 * compile ES6 to ES5 and ES6
 * copy any ES5 files to the appropriate destination and
 * minify them in place
 * compile any custom elements/webcomponents
 *
 * Expects ES6 files to have ext: .es6.js
 *         ES5 files to have ext: .es5.js
 *         WC/CE files to have ext: .w-c.es6.js
 *
 * @param { object } options The options from settings.json
 * @param { string } path    The folder that needs to be compiled, optional
 */
module.exports.scripts = async (options, path) => {
  const files = [];
  let folders = [];

  if (path) {
    const stats = await stat(`${RootPath}/${path}`);

    if (stats.isDirectory()) {
      folders.push(`${RootPath}/${path}`);
    } else if (stats.isFile()) {
      files.push(`${RootPath}/${path}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unknown path ${path}`);
      process.exit(1);
    }
  } else {
    folders = [
      `${RootPath}/build/media_source`,
      `${RootPath}/templates/cassiopeia`,
    ];
  }

  const folderPromises = [];

  // Loop to get the files that should be compiled via parameter
  // eslint-disable-next-line no-restricted-syntax
  for (const folder of folders) {
    folderPromises.push(recursive(folder, ['!*.+(js)']));
  }

  const computedFiles = await Promise.all(folderPromises);
  const computedFilesFlat = [].concat(...computedFiles);

  const jsFilesPromises = [];
  const wcFilesPromises = [];
  const esmFilesPromises = [];

  // Loop to get the files that should be compiled via parameter
  computedFilesFlat.forEach((file) => {
    if (file.includes(`build${sep}media_source${sep}vendor${sep}bootstrap${sep}js`)) {
      return;
    }

    if (file.match(/\.es5\.js$/)) {
      jsFilesPromises.push(handleES5File(file));
    } else if (file.match(/\.w-c\.es6\.js$/)) {
      wcFilesPromises.push(handleWCFile(file));
    } else if (file.match(/\.es6\.js$/)) {
      esmFilesPromises.push(handleESMFile(file));
    }
  });

  await Promise.all([...jsFilesPromises, ...wcFilesPromises, ...esmFilesPromises]);
};
