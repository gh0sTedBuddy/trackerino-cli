#! /usr/bin/env node
const yargs = require('yargs').argv
const path = require('path');
const i18n = require('i18n');
i18n.configure({
	locales: ['de','en'],
	directory: path.join(__dirname, 'Trackerino', 'locales')
})
const locale = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE || 'en'
i18n.setLocale((locale).split('_').shift().toLowerCase())
const readline = require('readline');

const notifier = require('node-notifier');

const Storage = require('./Storage')
const Trackerino = require('./Trackerino');

if(yargs.version || yargs.v) {
	let { version, name } = require('./package.json')
	console.log(version)
	process.exit(0)
}

let today = null
if(yargs.today) {
	try {
		today = new Date(Date.parse(yargs.today))
	}
	catch (err) {
		console.log(err)
		process.exit(1)
	}
}

const $storage = new Storage({
	date: today
})

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	completer: function () {
		console.log('TODO: something')
	}
})

const trackerino = new Trackerino({
	storage: $storage,
	date: today,
	onTick: function (_interface) {},
	onNotify: function (options) {
		notifier.notify({
			title: options.title || 'Trackerino CLI',
			message: options.message || 'No Message (yet?)!',
			sound: options.sound || false,
			wait: options.wait || false
		});
	},
	onAsk: (q, handle) => rl.question(q, handle),
	onError: text => console.error('ERR', text),
	onOutput: (text, cmd) => {
		console.log(text)
	}
})

let _AppInterval = setInterval(trackerino.save.bind(trackerino), 10000)

rl.on("close", () => {
	clearInterval(_AppInterval)
	trackerino.onClose()
})