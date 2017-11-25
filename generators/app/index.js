'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('packageName', {
      type: String,
      desc: 'Package name (part of Package.widget.WidgetName)',
      required: false
    });

    this.option('widgetName', {
      type: String,
      desc: 'Widget name (part of Package.widget.WidgetName)',
      required: false
    });

    this.option('friendlyWidgetName', {
      type: String,
      desc: 'Friendly widget name in Modeler (leave blank to use name above)',
      required: false
    });

    this.option('license', {
      type: String,
      desc:
        'Select a license, so no license prompt will happen, in case you want to handle it outside of this generator',
      required: false
    });
  }

  initializing() {
    this.props = {};
    this.composeWith(require.resolve('./widget'), this.options);
    this.composeWith(require.resolve('generator-license'), this.options);
  }
};
