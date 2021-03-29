const axios = require('axios')
const moment = require('moment')
const BaseModel = require('./BaseModel')

const slugify = require('../Helpers/slugify')

class Project extends BaseModel {
	constructor () {
		super()

		this.data = {
			...this.data,
			redmine_api_endpoint: null,
			redmine_api_key: null,
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
		_interface.options.storage.set('project', this.get('name'))
	}

	_exportCSV (tasks, _interface) {
		let csvData = []
		csvData.push([
			"DATE",
			"START",
			"END",
			"AMOUNT",
			"COMPANY",
			"PROJECT",
			"CATEGORY",
			"TASK",
		])

		tasks.map(task => csvData.push([
			moment.unix(task.started_at).format(_interface.options.dateFormat),
			moment.unix(task.started_at).format(_interface.options.timeFormat),
			moment.unix(task.ended_at).format(_interface.options.timeFormat),
			task.amount.toFixed(2).split('.').join(','),
			this.get('company'),
			task.project,
			task.category || '',
			task.task
		]))

		return csvData.map(entry => {
			return `"${ entry.join("\"\t\"") }"`
		}).join("\n")
	}

	async export (_value, _interface) {
		const files = _interface.options.storage.getAll()
		let tasks = []
		files.forEach(file => {
			if(file.tasks && file.tasks.length > 0) {
				file.tasks.filter(_task => {
					return _task && _task.project && _task.project == this.get('name')
				}).forEach(task => tasks.push(task))
			}
		})
		switch(_value.toLowerCase()) {
			default:
				_interface.say('unknown format, default: csv')
			case 'csv':
				_interface.say(this._exportCSV(tasks, _interface))
				break
			case 'json':
				break
			case 'redmine':
				const endpoint_uri = this.get('redmine_api_endpoint')
				const endpoint_key = this.get('redmine_api_key')
				if(!endpoint_uri || !endpoint_key) {
					_interface.say(`api endpoint or key is missing:\n\t/${this.get('id')}.redmine_api_endpoint [YOUR ENDPOINT]\n\t/${this.get('id')}.redmine_api_key [YOUR KEY]\n`)
					return
				}

				// try to send post requests for each task to redmine
				for(let _index = 0; _index < tasks.length; _index++) {
					const task = tasks[_index]
					if(!task.is_idle) {
						await axios.post(endpoint_uri, {
							key: endpoint_key,
							time_entry: {
								spent_on: moment.unix(task.started_at).format(_interface.options.dateFormat),
								issue_id: 7938,
								project_id: 116,
								hours: task.amount,
								comments: task.task
							}
						})
					}
				}

				break
		}
	}

	redmine_api_endpoint (_value, _interface) {
		if(!!_value) {
			this.data.redmine_api_endpoint = _value
		}
	}

	redmine_api_key (_value, _interface) {
		if(!!_value) {
			this.data.redmine_api_key = _value
		}
	}

	company(_value, _interface) {
		if(!!_value) {
			this.data.company = _value
		}
	}
}

module.exports = Project