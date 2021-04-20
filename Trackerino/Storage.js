const fs = require('fs')
const moment = require('moment')
const Models = require('./Models')

const __homedir = require('os').homedir();

class Storage {
	constructor () {
		this.options = {
			date: null,
			path: `${ __homedir }/.Trackerino`,
			...(arguments[0] || {})
		}

		if(!!this.options.date) {
			this.filename = this.options.date.format('YYYY-MM-DD')
		} else {
			this.filename = moment().format('YYYY-MM-DD')
		}

		if(!fs.existsSync(this.options.path)) {
			fs.mkdirSync(this.options.path);
		}

		this.data = {
			data: {
				started_at: this.options.date ? this.options.date.unix() : moment().unix(),
				project: null,
				category: null,
				totalAmount: 0.0,
				tasks: []
			},
			lists: [],
			trackers: [],
			projects: [],
			categories: [],
			todos: [],
			config: {
				daily_work_time: 8
			}
		}
	}

	setDate (date) {
		this.setFilename(date.format('YYYY-MM-DD'))
		if(moment(this.get('started_at')).format('YYYY-MM-DD') != date.format('YYYY-MM-DD')) {
			this.data.started_at = date.unix()
		}
	}

	setFilename (name) {
		this.filename = name
		this.load()
	}

	getPath () {
		return this.options.path
	}

	getAll () {
		let all = []
		let files = fs.readdirSync(this.options.path)
		files.filter(fname => fname.match(/\d{4}\-\d{2}\-\d{2}\.json/i)).map((fName, _index) => {
			let key = fName.split('.').shift()
			try {
				let content = fs.readFileSync(`${ this.getPath() }/${ fName }`)
				content = JSON.parse(content)
				if(!!content && !!content.tasks && content.tasks.length > 0) {
					all.push(content)
				}
			} catch(err) {
				console.log(err)
			}
		})

		return all
	}

	load () {
		let keys = Object.keys(this.data)
		for(let _index = 0; _index < keys.length; _index++) {
			let key = keys[_index]

			if('data' === key) {
				key = this.filename
			}

			if(fs.existsSync(`${ this.options.path }/${ key }.json`)) {
				try {
					let content = fs.readFileSync(`${ this.options.path }/${ key }.json`, 'utf8')
					if('data' === keys[_index]) {
						key = keys[_index]
					}

					if(Array.isArray(this.data[key])) {
						this.data[key] = [
							...this.data[key],
							...(JSON.parse(content) || [])
						]
					} else if('object' === typeof this.data[key]) {
						this.data[key] = {
							...this.data[key],
							...(JSON.parse(content) || [])
						}
					} else {
						this.data[key] = JSON.parse(content)
					}
					switch(key) {
						case 'data':
							if(!!this.data[key].tasks && this.data[key].tasks.length > 0) {
								this.data[key].tasks = this.data[key].tasks.map(data => {
									return new Models.Task(data)
								})
							}
							break
						case 'config':
							this.data[key] = {
								daily_work_time: 8,
								...this.data[key]
							}
							break
						case 'projects':
							if(!!this.data[key] && this.data[key].length > 0) {
								this.data[key] = this.data[key].map(data => {
									return new Models.Project(data)
								})
							}
							break
						case 'categories':
							if(!!this.data[key] && this.data[key].length > 0) {
								this.data[key] = this.data[key].map(data => {
									return new Models.Category(data)
								})
							}
							break
						case 'lists':
							if(!!this.data[key] && this.data[key].length > 0) {
								this.data[key] = this.data[key].map(data => {
									return new Models.List(data)
								})
							}
							break
						case 'trackers':
							if(!!this.data[key] && this.data[key].length > 0) {
								this.data[key] = this.data[key].map(data => {
									return new Models.Tracker(data)
								})
							}
							break
						case 'todos':
							if(!!this.data[key] && this.data[key].length > 0) {
								this.data[key] = this.data[key].map(data => {
									return new Models.Todo(data)
								})
							}
							break
					}
				} catch(err) {
					console.log('ERR', err)
					process.exit(1)
				}
			}
		}
	}

	save () {
		let cb = arguments[0] || null

		let keys = Object.keys(this.data)
		for(let _index = 0; _index < keys.length; _index++) {
			let key = keys[_index]
			let data = this.data[key] || null

			switch(key) {
				case 'data':
					key = this.filename
					data = {...this.data.data}

					if(!!data.tasks && data.tasks.length > 0) {
						data.tasks = data.tasks.map(task => {
							if(!!task.getData && typeof task.getData == 'function') {
								return task.getData()
							} else {
								return task
							}
						})
					}
					break
				case 'config':
					try {
						data.daily_work_time = parseInt(data.daily_work_time)
					} catch(err) {
						console.log(err)
					}
					break
				default:
					data = data.map(entry => {
						if(!!entry.getData && typeof entry.getData == 'function') {
							return entry.getData()
						} else {
							return entry
						}
					})
					break
			}

			fs.writeFileSync(
				`${ this.options.path }/${ key }.json`,
				JSON.stringify(data, null, 2)
			)
		}

		if(null !== cb) {
			cb()
		}
	}

	get (key) {
		let _default = arguments[1] || null
		if(!!this.data[key]) {
			return this.data[key]
		} else if(!this.data[key] && !!this.data.data[key]) {
			return this.data.data[key]
		}

		return _default
	}

	set (key, value) {
		if((!!this.data[key] || this.data[key] === null) && 'data' !== key) {
			this.data[key] = value
		} else if(!this.data[key] && (!!this.data.data[key] || this.data.data[key] === null) && 'data' !== key) {
			this.data.data[key] = value
		} else {
			console.error(`key: ${ key } not found in storage`)
		}
	}

	increase (key, amount) {
		if(isNaN(amount)) {
			return false
		}

		this.set(key, this.get(key, 0) + amount)
	}
}

module.exports = Storage