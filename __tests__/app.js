'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const packageName = 'Package';
const widgetName = 'TestWidget';
const friendlyWidgetName = 'TestWidget';

const fileWidgetXML = `src/${packageName}/${widgetName}.xml`;
const fileWidgetJS = `src/${packageName}/widget/${widgetName}.js`;

describe('generator-mendix-widget (all prompts)', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      packageName,
      widgetName,
      friendlyWidgetName
    });
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.babelrc',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc',
      '.gitignore',
      'Gulpfile.js',
      'postcss.config.js',
      'webpack.config.js',
      'widgetpackage.template.xml.ejs',
      fileWidgetXML,
      fileWidgetJS,
      `src/${packageName}/widget/${widgetName}.scss`,
      `src/${packageName}/widget/${widgetName}.template.html`,
      `src/${packageName}/widget/Core.js`,
      `src/${packageName}/widget/Libraries.js`
    ]);
  });

  it('contains the right ids', () => {
    assert.fileContent(fileWidgetXML, `${packageName}.widget.${widgetName}`);
    assert.fileContent(fileWidgetXML, `<name>${friendlyWidgetName}</name>`);
    assert.fileContent(fileWidgetJS, `'${widgetName}'`);
  });

  it('has the right values in package.json', () => {
    assert.jsonFileContent('package.json', {
      widget: {
        package: packageName,
        filesFolder: 'widget',
        libraries: false,
        core: false,
        path: false
      }
    });
  });
});

describe('generator-mendix-widget (no friendly name)', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      packageName,
      widgetName
    });
  });

  it('contains the right ids', () => {
    assert.fileContent(fileWidgetXML, `<name>${widgetName}</name>`);
  });
});
