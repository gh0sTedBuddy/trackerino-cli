const moment = require('moment')

function TasksCommand (_input, _instance) {
	let tasks = this.options.storage.get('tasks', [])
	tasks.map((task, index) => {
		 this.say(`[${ index }] ${ '\x1b[32m' }${ task.amount.toFixed(2) }${ '\x1b[0m' }\t${ moment.unix(task.started_at).format(this.options.timeFormat) }-${ moment.unix(task.ended_at).format(this.options.timeFormat) }\t${ task.task }`)
	})
	this.say(`- to update a task just enter ${ '\x1b[2m' }/update [index] [correction] (optional)[new description] ${ '\x1b[0m' }`)
	this.say(`- to delete a task just enter ${ '\x1b[2m' }/delete [index]${ '\x1b[0m' }`)
}

module.exports = {
	cmd: 'tasks',
	description: 'prints a list of all tasks from today',
	handle: TasksCommand
}