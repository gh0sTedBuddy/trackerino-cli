#! /usr/bin/env node
const yargs = require('yargs').argv
const path = require('path');
const i18n = require('i18n');
i18n.configure({
	locales: ['de','en'],
	directory: path.join(__dirname, 'TimeGenius', 'locales')
})
const locale = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE
i18n.setLocale((locale).split('_').shift().toLowerCase())
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

const $storage = new Storage({
	date: today
})

const timeGenius = new TimeGenius({
	storage: $storage,
	date: today,
	onAsk: (q, handle) => rl.question(q, handle),
	onError: text => console.error('ERR', text),
	onOutput: (text, cmd) => {
		console.log(text)
	}
})

let _AppInterval = setInterval(timeGenius.save.bind(timeGenius), 10000)

rl.on("close", () => {
	clearInterval(_AppInterval)
	timeGenius.onClose()
})