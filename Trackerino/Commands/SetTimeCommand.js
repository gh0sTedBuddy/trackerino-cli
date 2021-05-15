function SetTimeCommand (_input, _instance) {
	let timeRegex = /^(\d{2})\:(\d{2})$/
	if(timeRegex.test(_input)) {
		let [time, hours, minutes] = _input.match(timeRegex)
		hours = parseInt(hours)
		minutes = parseInt(minutes)

		this.currentTime.hours(hours)
		this.currentTime.minutes(minutes)
		this.isRealTime = false
		this.say(`set current time: ${ format(this.currentTime, this.options.timeFormat) }`)
	} else {
		this.say(`wrong time format, kept time at current time: ${ format(this.currentTime, this.options.timeFormat) }`)
	}
}

module.exports = {
	cmd: 'set',
	description: 'sets current time to your value',
	usage: `/set 00:00`,
	handle: SetTimeCommand
}