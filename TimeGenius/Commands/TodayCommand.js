const moment = require('moment')

function TodayCommand (_input, _instance) {
	let totalTime = 0
	let idleTime = 0
	this.data.tasks.map((task, index) => {
		if(!task) return
		if(!this.project || task.project == this.project) {
			let output = [
				`[${ totalTime.toFixed(2) } ${ !!task.is_idle ? '\x1b[47m' : '\x1b[32m' } +${ (task.amount).toFixed(2) } ${ '\x1b[0m' }]`
			]

			if(task.project) {
				output.push(`[\x1b[36m${ task.project }\x1b[0m]`)
			} else {
				output.push('[--]')
			}

			output.push(`${ moment.unix(task.started_at).format(this.timeFormat) }-${ moment.unix(task.ended_at).format(this.timeFormat) }`)
			output.push(task.task)

			if(!!task.is_idle) {
				idleTime += task.amount
			}
			totalTime += task.amount

			this.say(output.join("\t"))
		}
	})
	this.say(
		`[${ (totalTime).toFixed(2) }] total time today.`,
		`[${ (idleTime).toFixed(2) }] idle`
	)
	this.say(`[${ (totalTime - idleTime).toFixed(2) }] total work today.`)
}

module.exports = {
	cmd: 'today',
	description: 'list all tasks for today and show how much time you invested to finish them',
	handle: TodayCommand
}