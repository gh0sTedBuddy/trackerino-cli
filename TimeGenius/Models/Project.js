const moment = require('moment')
const BaseModel = require('./BaseModel')

const slugify = require('../Helpers/slugify')

class Project extends BaseModel {
	constructor () {
		super()

		this.data = {
			...this.data,
			name: '',
			slug: null,
			amount: 0.0,
			...(arguments[0] || {})
		}

		if(!!this.data.name) {
			this.data.slug = slugify(this.data.name)
		}
	}
}

module.exports = Project