#! /usr/bin/env node
const yargs = require('yargs').argv
const readline = require('readline');
const moment = require('moment');

const Storage = require('./TimeGenius/Storage')
const TimeGenius = require('./TimeGenius');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

let today = null
if(yargs.today) {
	try {
		today = moment(yargs.today).startOf()
	}
	catch (err) {
		console.log(err)
		process.exit(1)
	}
}

if(yargs.version || yargs.v) {
	let { version, name } = require('./package.json')
	console.log(version)
	process.exit(0)
}

const timeGenius = new TimeGenius({
	storage: new Storage(),
	date: today,
	onAsk: (q, handle) => rl.question(q, handle),
	onOutput: (text, cmd) => console.log(text)
})

let _AppInterval = setInterval(timeGenius.save.bind(timeGenius), 10000)

rl.on("close", () => {
	clearInterval(_AppInterval)
	timeGenius.onClose()
})