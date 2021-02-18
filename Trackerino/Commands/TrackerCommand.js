const Models = require('../Models')
function TrackerCommand (_input, _instance) {
	let project = this.options.storage.get('project', null)
	let tracker = this.options.storage.get('trackers', [])

	let newTracker = new Models.Tracker({
		name: _input
	})
	tracker.push(newTracker)

	this.say(`➕ created tracker: ${ newTracker.get('name') } (${ newTracker.get('id') })`)

	this.options.storage.set('trackers', tracker)
}

module.exports = {
	cmd: 'tracker',
	description: 'creates a new tracker',
	handle: TrackerCommand
}