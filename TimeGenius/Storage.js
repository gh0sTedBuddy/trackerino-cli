const fs = require('fs')
const moment = require('moment')

const __homedir = require('os').homedir();

class Storage {
	constructor () {
		this.filename = moment().format('YYYY-MM-DD')
		this.options = {
			path: `${ __homedir }/.TimeGenius`,
			...(arguments[0] || {})
		}

		this.data = {
			data: {
				started_at: moment().unix(),
				project: null,
				totalAmount: 0.0,
				tasks: []
			},
			projects: [],
			todos: []
		}
	}

	setFilename (name) {
		this.filename = name
	}

	getPath () {
		return this.options.path
	}

	getAll () {
		let files = fs.readdirSync(this.options.path)
		return files.filter(fname => fname.match(/\d{4}\-\d{2}\-\d{2}\.json/i))
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
					this.data[key] = JSON.parse(content)
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

			if('data' === key) {
				key = this.filename
				data = this.data.data
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