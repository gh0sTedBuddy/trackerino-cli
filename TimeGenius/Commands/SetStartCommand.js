const moment = require('moment')

function SetStartCommand (_input, _instance) {
	let regex = /^(\d{2})\:(\d{2})$/
	if(regex.test(_input)) {
		let startedTime = moment.unix(this.data.started_at)
		let [time, hours, minutes] = _input.match(regex)
		hours = parseInt(hours)
		minutes = parseInt(minutes)

		startedTime.hours(hours)
		startedTime.minutes(minutes)
		this.data.started_at = startedTime.unix()

		this.say(`set current time: ${ startedTime.format(this.timeFormat) }`)

		if(!!this.data.tasks && this.data.tasks.length > 0) {
			let firstTask = this.data.tasks[0]
			if(firstTask.started_at != startedTime.unix()) {
				firstTask.started_at = startedTime.unix()
				firstTask.amount = parseFloat(((firstTask.ended_at - firstTask.started_at) / 60 / 60).toFixed(2))
				this.say(`adjusted your first task of the day`)
				this.data.tasks[0] = firstTask
				this.getAnswer('/tasks')
			}
		}
	} else {
		this.logError(`wrong time format, kept time at current time: ${ currentTime.format(this.timeFormat) }`)
	}
}

module.exports = {
	cmd: 'started', // aliases: /start
	description: 'sets the time you started your day',
	handle: SetStartCommand
}