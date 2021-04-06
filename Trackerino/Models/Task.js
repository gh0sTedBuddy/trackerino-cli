const moment = require('moment')
const ProjectModel = require('./Project')
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

	project (_value, _interface) {
		const projects = _interface.options.storage.get('projects', [])
		if(!!_value) {
			console.log(`set project of ${ this.get('id') } to ${ _value }`)
			let proj = projects.filter(project => {
				return project.get('name').toLowerCase() === _value.toLowerCase()
			})

			if(!!proj && proj.length > 0) {
				proj = proj.shift()
			} else {
				projects.push(new ProjectModel({
					name: _value
				}))
				_interface.options.storage.set('projects', projects)
			}
			this.data.project = _value
		}
	}
}

module.exports = Task