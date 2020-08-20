const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename);
let commandList = {}

var files = fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach((file) => {
		var cmd_name = file.split('.')[0];
		commandList[cmd_name] = require('./'+file);
	});

module.exports = commandList