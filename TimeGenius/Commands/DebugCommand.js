function DebugCommand (_input, _instance) {
	console.log(this.data)
}

module.exports = {
	cmd: 'debug',
	description: 'shows the current data object',
	handle: DebugCommand
}