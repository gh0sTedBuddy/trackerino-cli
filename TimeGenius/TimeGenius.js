const fs = require('fs');
const yargs = require('yargs').argv
const readline = require('readline');
const moment = require('moment')
const CommandList = require('./Commands');

const slugify = require('./Helpers/slugify')

const __homedir = require('os').homedir();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

let lastActionAt = moment.unix()

class TimeGenius {
	constructor () {
		let { version, name } = require('../package.json')
		this.name = name
		this.version = version
		this.saveDelay = 10000

		this._interval = setInterval(this.save.bind(this), this.saveDelay)

		this.dateFormat = 'YYYY-MM-DD'
		this.timeFormat = 'HH:mm'

		this.commands = {}
		this.init()
	}

	init () {
		this.isRealTime = true
		this.currentTime = moment()
		if(yargs.today) {
			try {
				this.currentTime = moment(yargs.today).startOf()
				this.isRealTime = false
			}
			catch (err) {
				console.log(err)
				process.exit(1)
			}
		}

		if(yargs.version || yargs.v) {
			console.log(this.version)
			process.exit(0)
		}

		for(let _key in CommandList) {
			this.registerCommand(CommandList[_key])
		}

		this.registerBaseCommands ()

		rl.on("close", this.onClose.bind(this))

		this.data = {
			filename: `${ this.currentTime.format(this.dateFormat) }.json`,
			previous_filename: `${ this.currentTime.clone().subtract(1, 'd').format(this.dateFormat) }.json`,
			path: __homedir + '/.TimeGenius',
			started_at: this.currentTime.unix(),
			project: null,
			totalAmount: 0.0,
			tasks: []
		}

		this.projectsList = []
		this.todos = []

		this.load()

		this.say(`⏰ Welcome to ${ this.name } v${ this.version }`)

		this.ask()
	}

	registerBaseCommands () {
		/*
		* add command /idle to automatically calculate the current time spent for idle time (pauses, breaks, private time, etc.)
		*/
		this.registerCommand({
			cmd: 'idle',
			handle: _input => {
				let inputDescription = _input.split(' ')
				inputDescription.shift()
				this.add(inputDescription.join(' '), true)
				return this.ask()
			}
		})

		/**
		* add command /realtime to reset /set by setting the system back to real time
		*/
		this.registerCommand({
			cmd: 'realtime',
			handle: _input => {
				if(!this.isRealTime) {
					this.isRealTime = true
					this.currentTime = moment()
					console.log('set back to real time.')
				}
				return this.ask()
			}
		})
	}

	load () {
		// load tasks file
		if(fs.existsSync(`${ this.data.path }/${ this.data.filename }`)) {
			this.data = require(`${ this.data.path }/${ this.data.filename }`)
			if(!this.data.tasks) {
				this.data.tasks = []
			}
			console.log(`💾 loaded existing file ${ this.data.filename }\n`)
		}

		// load projects
		if(!fs.existsSync(`${ this.data.path }/projects.json`)) {
			fs.writeFileSync(`${ this.data.path }/projects.json`, JSON.stringify(this.projectsList, null, 2))
		} else {
			this.projectsList = require(`${ this.data.path }/projects.json`)
		}

		// load todos
		if(!fs.existsSync(`${ this.data.path }/todos.json`)) {
			fs.writeFileSync(`${ this.data.path }/todos.json`, JSON.stringify(this.todos, null, 2))
		} else {
			this.todos = require(`${ this.data.path }/todos.json`)
		}
	}

	say (text) {
		console.log(text)
	}

	ask () {
		let question = [`\n⏱  What have you done?`]
		if(this.data.project) {
			question.push(`[\x1b[36m${ this.data.project }\x1b[0m]`)
		}
		rl.question(question.join(' ') + ' ', this.getAnswer.bind(this))
	}

	getAnswer (_input) {
		if(!_input) {
			this.logError('no description given')
			return this.ask()
		}

		if(_input.toLowerCase() == 'q' || _input.toLowerCase() == 'quit') {
			return this.onClose()
		}

		if(_input.toLowerCase() == 'clear') {
			console.clear()
			return this.ask()
		}

		// check for commands
		for(let _key in this.commands) {
			let inputParts = _input.split(' ')
			if(inputParts.shift().toLowerCase() == `/${ _key }`) {
				this.commands[_key].handle(inputParts.join(' '))
				return this.ask()
			}
		}

		if(_input.startsWith('/')) {
			this.logError(`command not found ${ _input }`)
			return this.ask()
		}

		this.add(_input)

		this.ask()
	}

	getLastTaskEndTime (defaultValue = null) {
		if(this.data.tasks.length > 0) {
			return this.data.tasks[this.data.tasks.length-1].ended_at || defaultValue || this.data.started_at
		}
		return defaultValue
	}

	registerCommand (command) {
		this.commands[command.cmd] = {
			...command,
			...{ handle: command.handle.bind(this) }
		}
	}

	save () {
		const callback = arguments[0] || null

		fs.writeFileSync(`${ this.data.path }/${ this.data.filename }`, JSON.stringify(this.data, null, 2))
		fs.writeFileSync(`${ this.data.path }/todos.json`, JSON.stringify(this.todos, null, 2))
		fs.writeFileSync(`${ this.data.path }/projects.json`, JSON.stringify(this.projectsList, null, 2))

		if(callback != null) {
			callback()
		}
	}

	add (task) {
		let isIdle = arguments[1] || false
		let started_at = this.getLastTaskEndTime(this.data.started_at)
		let ended_at = this.isRealTime ? moment().unix() : this.currentTime.unix()
		let amount = parseFloat(((ended_at - started_at) / 60 / 60).toFixed(2))

		if(!this.data.totalAmount) this.data.totalAmount = 0

		this.data.totalAmount += amount

		if(!this.data.tasks) this.data.tasks = []

		this.data.tasks.push({
			project: !!isIdle ? null : this.data.project,
			task: task,
			started_at: started_at,
			ended_at: ended_at,
			is_idle: !!isIdle,
			amount: amount
		})

		if(isIdle) {
			this.say(`😴 pssst... you're ${ task || 'sleeping (?!)' } for ${ amount } hours (or ${ (amount * 60).toFixed(2) } minutes). 💤`)
			process.stderr.write("\x07")
		} else {
			this.say(`✅ awesome! that only took you ${ amount } hours (or ${ (amount * 60).toFixed(2) } minutes). 👍`)
		}
	}

	onClose () {
		console.log("\n👋 BYE 😊\n")
		this.save(() => {
			process.exit(0)
		})
	}

	logError(text) {
		console.error(`\n⚠️\tERR: ${ text }`)
	}

	getAllFiles () {
		// run through all files and return their tasks
		let files = fs.readdirSync(this.data.path)
		return files.filter(file => file.match(/(\d{4}\-\d{2}\-\d{2})\.json/i))
	}
}

module.exports = TimeGenius