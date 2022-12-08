"use strict";
const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("node:path");

_.extend(Generator.prototype, require("yeoman-generator/lib/actions/install"));

function parseScopedName(name) {
  const nameFragments = name.split("/");
  const parseResult = {
    scopeName: "",
    localName: name,
  };

  if (nameFragments.length > 1) {
    parseResult.scopeName = nameFragments[0];
    parseResult.localName = nameFragments[1];
  }

  return parseResult;
}

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option("name", {
      type: String,
      required: false,
      desc: "Project name",
    });
  }

  initializing() {
    this.props = {};
  }

  prompting() {
    const prompts = [
      {
        name: "name",
        message: "App name?",
        default: path.basename(this.destinationPath()),
        when: !this.options.name,
      },
      {
        name: "description",
        message: "App description?",
        default: "Node.js with typescript, winston.",
      },
      {
        type: "list",
        name: "pkgManager",
        message: "Use yarn or npm to manage your dependencies?",
        default: "yarn",
        choices: [
          { name: "yarn", value: "yarn" },
          { name: "npm", value: "npm" },
        ],
        when: !this.options["skip-install"],
      },
    ];

    return this.prompt(prompts).then((props) => {
      const name = props.name || this.options.name;
      const parsed = parseScopedName(name);
      this.props = {
        name,
        scopeName: parsed.scopeName,
        localName: parsed.localName,
        ...props,
      };
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.localName) {
      this.log(`Automatically create ${this.props.localName} folder.`);
      mkdirp.sync(this.props.localName);
      this.destinationRoot(this.destinationPath(this.props.localName));
    }
  }

  writing() {
    this.fs.copyTpl(this.templatePath(), this.destinationPath(), this.props);
  }

  install() {
    if (!this.options["skip-install"]) {
      this.installDependencies({
        bower: false,
        yarn: this.props.pkgManager === "yarn",
        npm: this.props.pkgManager === "npm",
        skipMessage: this.options["skip-install-message"],
        skipInstall: this.options["skip-install"],
      });
    }
  }
};
