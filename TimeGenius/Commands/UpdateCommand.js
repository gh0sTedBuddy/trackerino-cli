function UpdateCommand (_input, _instance) {
	try {
		let inputParts = _input.split(' ')
		let updateIndex = parseInt(inputParts.shift())
		let correction = parseFloat(inputParts.shift() || 0)
		let description = inputParts.join(' ')
		if(updateIndex >= 0 && updateIndex < this.data.tasks.length) {
			let task = this.data.tasks[updateIndex]

			if(correction !== 0) {
				task.amount += correction
				task.ended_at += correction * 60 * 60
			}

			if(description) {
				task.task = description
			}

			this.data.tasks[updateIndex] = task
			this.say(`updated task #${ updateIndex } with ${ correction } hours`, !!description ? `and new description: ${ '\x1b[2m' }${ description }${ '\x1b[0m' }` : '')
			this.getAnswer('/tasks')
		} else {
			this.say(`ERR: no task index given`)
		}
	} catch(err) {
		this.logError(err)
	}
}

module.exports = {
	cmd: 'update',
	description: 'updates an task by its index',
	handle: UpdateCommand
}