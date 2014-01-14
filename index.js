/*jshint node:true */

"use strict";

var through = require('through');

module.exports = function (doit, child) {
	if (!child) {
		throw new Error('gulp-if: child action is required');
	}
	// when we get a file:
	// if it passes we write it back to ourselves via the child that is piped to us
	// we attach a field to it to not run the truth test again
	var process = function(file) {
		if (file._ignore) {
			delete file._ignore;
			this.queue(file);
			return;
		}

		if (typeof doit === 'function') {
			if (doit(file)) {
				file._ignore = true;
				child.write(file);
			}
			return
		}
		if (typeof doit ==='boolean' && doit) {
			file._ignore = true;
			child.write(file);
		}
	};
	var outStream = through(process);
	child.pipe(outStream);
	return outStream;
};
