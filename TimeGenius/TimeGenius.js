const moment = require('moment')
const CommandList = require('./Commands');

const slugify = require('./Helpers/slugify')


class TimeGenius {
	constructor () {
		let { version, name } = require('../package.json')

		this.name = name
		this.version = version
		this.options = {
			...{
				storage: null,
				date: null,
				dateFormat: 'YYYY-MM-DD',
				timeFormat: 'HH:mm',
				onAsk: () => {},
				onClose: () => {},
				onOutput: () => {},
				onError: () => {}
			},
			...(arguments[0] || {})
		}

		this.commands = {}
		this.init()
	}

	init () {
		this.isRealTime = true
		this.currentTime = moment()

		for(let _key in CommandList) {
			this.registerCommand(CommandList[_key])
		}

		this.registerBaseCommands ()

		this.load()

		this.say(`⏰ Welcome to ${ this.name } v${ this.version }`)

		this.ask()
	}

	storage () {
		return this.options.storage
	}

	registerBaseCommands () {
		/*
		* add command /idle to automatically calculate the current time spent for idle time (pauses, breaks, private time, etc.)
		*/
		this.registerCommand({
			cmd: 'idle',
			handle: _input => {
				this.add(_input, true)
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
					this.say('set back to real time.')
				}
				return this.ask()
			}
		})
	}

	load () {
		if(!!this.options.storage) {
			this.options.storage.load()
		}
	}

	say (text) {
		let cmd = arguments[1] || null
		this.options.onOutput(text, cmd)
	}

	ask () {
		let question = [`\n⏱  What have you done?`]
		if(!!this.options.storage.get('project')) {
			question.push(`[\x1b[36m${ this.options.storage.get('project') }\x1b[0m]`)
		}
		this.options.onAsk(question.join(' ') + ' ', this.getAnswer.bind(this))
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
		let tasks = this.options.storage.get('tasks')
		if(tasks.length > 0) {
			return tasks[tasks.length-1].ended_at || this.options.storage.get('started_at', defaultValue)
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

		if(!!this.options.storage) {
			this.options.storage.save(callback)
		}
	}

	add (task) {
		let isIdle = arguments[1] || false
		let started_at = this.getLastTaskEndTime(this.options.storage.get('started_at', moment().unix()))
		let ended_at = this.isRealTime ? moment().unix() : this.currentTime.unix()
		let amount = parseFloat(((ended_at - started_at) / 60 / 60).toFixed(2))

		if(!this.options.storage.get('totalAmount')) this.options.storage.set('totalAmount', 0)

		this.options.storage.increase('totalAmount', amount)

		let tasks = this.options.storage.get('tasks', [])

		tasks.push({
			project: !!isIdle ? null : this.options.storage.get('project'),
			task: task,
			started_at: started_at,
			ended_at: ended_at,
			is_idle: !!isIdle,
			amount: amount
		})

		this.options.storage.set('tasks', tasks)

		if(isIdle) {
			this.say(`😴 pssst... you're ${ task || 'sleeping (?!)' } for ${ amount } hours (or ${ (amount * 60).toFixed(2) } minutes). 💤`)
			if(!!process && !!process.stderr) process.stderr.write("\x07")
		} else {
			this.say(`✅ awesome! that only took you ${ amount } hours (or ${ (amount * 60).toFixed(2) } minutes). 👍`)
		}
	}

	onClose () {
		this.save(() => {
			this.say("\n👋 BYE 😊\n")
			process.exit(0)
		})
	}

	logError(text) {
		this.onError(text)
	}
}

module.exports = TimeGenius