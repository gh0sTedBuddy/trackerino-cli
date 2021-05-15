const {format} = require('date-fns')

function ExportCommand (_input) {
	let tasks = this.options.storage.get('tasks', [])
	let fileformat = 'csv'

	if(_input.toLowerCase() === 'json') {
		fileformat = 'json'
	}

	if(fileformat === 'csv') {
		let csvData = []
		csvData.push([
			"DATE",
			"START",
			"END",
			"AMOUNT",
			"PROJECT",
			"CATEGORY",
			"TASK",
		])

		tasks.map(task => csvData.push([
			format(this.currentTime, this.options.dateFormat),
			format(task.get('started_at'), this.options.timeFormat),
			format(task.get('ended_at'), this.options.timeFormat),
			task.get('amount').toFixed(2).split('.').join(','),
			'',
			task.get('project'),
			task.get('task')
		]))

		this.say(csvData.map(entry => {
			return `"${ entry.join("\"\t\"") }"`
		}).join("\n"))
	} else if(format === 'json') {
		let output = []

		tasks.map(task => output.push({
			date: format(this.currentTime, this.options.dateFormat),
			started_at: format(task.started_at, this.options.timeFormat),
			ended_at: format(task.ended_at, this.options.timeFormat),
			amount: task.amount,
			project: task.project,
			task: task.task
		}))

		this.say(JSON.stringify(output))
	}
}

module.exports = {
	cmd: 'export',
	description: 'exports todays task entries as csv or json',
	usage: '/export [csv|json](default: csv)',
	handle: ExportCommand
}