const moment = require('moment')
const BaseModel = require('./BaseModel')

class Task extends BaseModel {
	constructor () {
		super()

		this.data = {
			...this.data,
			task: '',
			started_at: moment().unix(),
			ended_at: null,
			is_idle: false,
			...(arguments[0] || {})
		}

		this.initMethods()
	}
}

module.exports = Task