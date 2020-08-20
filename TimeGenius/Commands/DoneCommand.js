function DoneCommand (_input, _instance) {
	try {
		let doneIndex = parseInt(_input)
		if(doneIndex >= 0) {
			if(doneIndex <= this.todos.length - 1) {
				let oldProject = this.data.project
				this.data.project = this.todos[doneIndex].project || null
				this.add(this.todos[doneIndex].task)
				this.data.project = oldProject
				let newTodos = []
				this.todos.map((todo, index) => {
					if(index !== doneIndex) {
						newTodos.push(todo)
					}
				})
				this.todos = newTodos
			} else {
				this.logError('no valid index given')
			}
		} else {
			console.log('ERR no valid done index')
		}
	} catch(err) {
		console.log('ERR ' . err)
	}
}

module.exports = {
	cmd: 'done',
	description: 'marks an todo as "done".',
	handle: DoneCommand
}