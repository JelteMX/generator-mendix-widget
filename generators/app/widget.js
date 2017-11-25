'use strict';
const Generator = require('yeoman-generator');
const pkg = require('../../package.json');
const extend = require('deep-extend');
const { getBanner } = require('../lib/text');

const widgetSrcFolder = 'src/Widget/widget';

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  _getPrompts() {
    return [
      {
        name: 'packageName',
        message: 'Package name (part of Package.widget.WidgetName)',
        default: 'Package',
        when: !this.props.packageName
      },
      {
        name: 'widgetName',
        message: 'Widget name (part of Package.widget.WidgetName)',
        default: 'Widget',
        when: !this.props.widgetName
      },
      {
        name: 'friendlyWidgetName',
        message: 'Friendly widget name in Modeler (leave blank to use name above)',
        when: !this.props.friendlyWidgetName
      }
    ];
  }

  prompting() {
    this.log(getBanner(pkg));

    const prompts = this._getPrompts();

    return this.prompt(prompts).then(props => {
      this.props = props;
      if (!props.friendlyWidgetName) {
        this.props.friendlyWidgetName = props.widgetName;
      }
    });
  }

  _copySourceFile(path, dest) {
    this.fs.copy(
      this.templatePath(`widget-base/${path}`),
      this.destinationPath(dest || path)
    );
  }

  _copySourceFiles() {
    this._copySourceFile('.babelrc');
    this._copySourceFile('.editorconfig');
    this._copySourceFile('.eslintignore');
    this._copySourceFile('.eslintrc');
    this.fs.copy(this.templatePath(`_gitignore`), this.destinationPath('.gitignore'));
    this._copySourceFile('Gulpfile.js');
    this._copySourceFile('postcss.config.js');
    this._copySourceFile('webpack.config.js');
    this._copySourceFile('widgetpackage.template.xml.ejs');
  }

  _writePackage() {
    const { packageName } = this.props;
    const source = this.fs.readJSON(this.templatePath(`widget-base/package.json`));
    extend(source, {
      widget: {
        package: packageName,
        libraries: false,
        core: false,
        path: false
      }
    });
    this.fs.writeJSON(this.destinationPath('package.json'), source);
  }

  _copyByNames() {
    const { packageName, widgetName } = this.props;

    this._copySourceFile(
      `${widgetSrcFolder}/Widget.scss`,
      `src/${packageName}/widget/${widgetName}.scss`
    );

    this._copySourceFile(
      `${widgetSrcFolder}/Widget.scss`,
      `src/${packageName}/widget/${widgetName}.scss`
    );

    this._copySourceFile(
      `${widgetSrcFolder}/Widget.template.html`,
      `src/${packageName}/widget/${widgetName}.template.html`
    );

    this._copySourceFile(
      `${widgetSrcFolder}/Core.js`,
      `src/${packageName}/widget/Core.js`
    );
    this._copySourceFile(
      `${widgetSrcFolder}/Libraries.js`,
      `src/${packageName}/widget/Libraries.js`
    );
  }

  _writeWidgetXML() {
    const { packageName, widgetName, friendlyWidgetName } = this.props;

    this.fs.copy(
      this.templatePath(`widget-base/src/Widget/Widget.xml`),
      this.destinationPath(`src/${packageName}/${widgetName}.xml`),
      {
        process: file => {
          let fileText = file.toString();
          fileText = fileText
            .replace(/Widget\.widget\.Widget/g, `${packageName}.widget.${widgetName}`)
            .replace(/<name>Widget<\/name>/g, `<name>${friendlyWidgetName}</name>`);
          return fileText;
        }
      }
    );
  }

  _writeWidgetJS() {
    const { packageName, widgetName } = this.props;

    this.fs.copy(
      this.templatePath(`widget-base/src/Widget/widget/Widget.js`),
      this.destinationPath(`src/${packageName}/widget/${widgetName}.js`),
      {
        process: file => {
          let fileText = file.toString();
          fileText = fileText.replace(/'Widget'/g, `'${widgetName}'`);
          return fileText;
        }
      }
    );
  }

  writing() {
    this._copySourceFiles();
    this._writeWidgetXML();
    this._writeWidgetJS();
    this._copyByNames();
    this._writePackage();
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
