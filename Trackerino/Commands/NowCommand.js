const moment = require('moment')

function NowCommand (_input) {
	let started_at = this.options.storage.get('started_at')
	const tasks = this.options.storage.get('tasks', [])

	this.say([
		`You started at: ${ moment.unix(started_at).format(this.options.timeFormat) }`,
		`and now is: ${ this.currentTime.format(this.options.timeFormat) }.`
	].join(' '))

	if(!!tasks && tasks.length > 0) {
		let workTime = tasks.filter(task => !task.get('is_idle')).map(task => task.get('amount')).reduce((a,c) => a+c)
		if(workTime > 0) {
			let timeLeft = (this.options.storage.get('config.daily_work_time') || 0) - workTime
			this.say(`Total work today: ${workTime.toFixed(2)} (${timeLeft > 0 ? timeLeft : 0})`)
		}
		let lastEntry = tasks[tasks.length - 1]
		if(lastEntry && lastEntry.get('ended_at')) {
			this.say(`You ended your last task at: ${ moment.unix(lastEntry.get('ended_at')).format(this.options.timeFormat) } (${ (this.currentTime).diff(moment.unix(lastEntry.get('ended_at')), 'minutes') } minutes ago).`)
		}
	}
}

module.exports = {
	cmd: 'now',
	description: 'shows you important data about the current moment',
	handle: NowCommand
}