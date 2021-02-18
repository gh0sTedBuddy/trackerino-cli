const moment = require('moment')

function ListsCommand (_input, _instance) {
	let trackers = this.options.storage.get('trackers', [])
	this.say(`${ trackers.length } tracker(s):`)
	trackers.map((tracker, index) => {
		this.say(`[${ tracker.get('id') }] ${ tracker.get('name') } (${ tracker.get('items').length } items)`)
		// this.say(`[${ index }] ${ '\x1b[32m' }${ list.amount.toFixed(2) }${ '\x1b[0m' }\t${ moment.unix(list.started_at).format(this.options.timeFormat) }-${ moment.unix(list.ended_at).format(this.options.timeFormat) }\t${ list.name }`)
	})
	// this.say(`- to update a task just enter ${ '\x1b[2m' }/update [index] [correction] (optional)[new description] ${ '\x1b[0m' }`)
	// this.say(`- to delete a task just enter ${ '\x1b[2m' }/delete [index]${ '\x1b[0m' }`)
}

module.exports = {
	cmd: 'trackers',
	description: 'prints all trackers',
	handle: ListsCommand
}