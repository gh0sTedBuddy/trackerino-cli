const moment = require('moment')

function ExportCommand (_input, _instance) {
	let format = 'csv'

	if(_input.toLowerCase() === 'json') {
		format = 'json'
	}

	if(format === 'csv') {
		let csvData = []
		csvData.push([
			"DATE",
			"START",
			"END",
			"AMOUNT",
			"PROJECT",
			"TASK",
		])

		this.data.tasks.map(task => csvData.push([
			this.currentTime.format(this.dateFormat),
			moment.unix(task.started_at).format(this.timeFormat),
			moment.unix(task.ended_at).format(this.timeFormat),
			task.amount,
			task.project,
			task.task
		]))

		this.say(csvData.map(entry => {
			return `"${ entry.join("\"\t\"") }"`
		}).join("\n"))
	} else if(format === 'json') {
		let output = []

		this.data.tasks.map(task => output.push({
			date: this.currentTime.format(this.dateFormat),
			started_at: moment.unix(task.started_at).format(this.timeFormat),
			ended_at: moment.unix(task.ended_at).format(this.timeFormat),
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