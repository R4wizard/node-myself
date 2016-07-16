"use strict";

const Module = require('module');
const findup = require('findup-sync');
const path = require('path');
const fs = require('fs');

class RequireOverrideError extends Error { }

class RequireOverride {
	constructor(dirname) {
		this.setPath(dirname);
	}

	setPath(path) {
		this.path = path;
		this.detectPackage();
	}

	detectPackage() {
		this.path_json = path.join(this.path, 'package.json');

		let stats;
		try {
			stats = fs.statSync(this.path_json);
		} catch(e) {
			throw new RequireOverrideError("unable to detect package.json for calling package");
		}

		if(!stats.isFile())
			throw RequireOverrideError("package.json is not a file");

		this.package = require(this.path_json);
		if(typeof this.package != 'object')
			throw new RequireOverrideError("package.json was unable to be parsed as a json object");

		if(!this.package.name.trim())
			throw new RequireOverrideError("package.json doesn't provide a valid package name");

		this._installIntercept();
	}

	_installIntercept() {
		this._load = Module._load;
		Module._load = (request, parent) => this._intercept(request, parent);
	}

	_intercept(request, parent) {
		if(request == this.package.name) {
			return this._load(path.join(this.path, this.package.main || "index.js"), parent);
		}

		return this._load(request, parent);
	}
}

module.exports = (dirname) => {
	return {
		RequireOverrideError: RequireOverrideError,
		Instance: new RequireOverride(dirname)
	};
};
