function DeleteCommand (_input, _instance) {
	try {
		let deleteIndex = parseInt(_input)
		if(deleteIndex != NaN && deleteIndex >= 0 && deleteIndex < this.data.tasks.length) {

			this.data.tasks = this.data.tasks.filter((task, _index) => {
				return task !== null && _index !== deleteIndex
			})

			this.say(`task with index ${ deleteIndex } was deleted`)
		}
	} catch(err) {
		this.logError(err)
	}

	this.getAnswer('/tasks')
}

module.exports = {
	cmd: 'delete',
	description: 'deletes an task entry.',
	handle: DeleteCommand
}