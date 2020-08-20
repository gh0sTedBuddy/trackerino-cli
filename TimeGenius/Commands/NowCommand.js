const moment = require('moment')

function NowCommand (_input, _instance) {
	this.say([
		`You started at: ${ moment.unix(this.data.started_at).format(this.timeFormat) }`,
		`and now is: ${ this.currentTime.format(this.timeFormat) }.`
	].join(' '))

	if(!!this.data.tasks && this.data.tasks.length > 0) {
		let lastEntry = this.data.tasks[this.data.tasks.length - 1]
		if(lastEntry && lastEntry.ended_at) {
			this.say(`You ended your last task at: ${ moment.unix(lastEntry.ended_at).format(this.timeFormat) } (${ (this.isRealTime ? moment() : currentTime).diff(moment.unix(lastEntry.ended_at), 'minutes') } minutes ago).`)
		}
	}
}

module.exports = {
	cmd: 'now',
	description: 'shows you important data about the current moment',
	handle: NowCommand
}