const moment = require('moment')
const BaseModel = require('./BaseModel')

const slugify = require('../Helpers/slugify')

class Project extends BaseModel {
	constructor () {
		super()

		this.data = {
			...this.data,
			name: '',
			company: null,
			slug: null,
			amount: 0.0,
			...(arguments[0] || {})
		}

		if(!!this.data.name) {
			this.data.slug = slugify(this.data.name)
		}
	}

	select (_value, _interface) {
		console.log(_interface)
	}

	export (_value, _interface) {
		let files = _interface.storage.getAll()
		console.log(files.length)
	}

	company(_value, _interface) {
		if(!!_value) {
			this.data.company = _value
		}
	}
}

module.exports = Project