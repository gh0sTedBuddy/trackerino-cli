function TodosCommand (_input, _instance) {
	if(this.todos && this.todos.length > 0) {
		let output = []
		for(let index = 0; index < this.todos.length; index++) {
			let entry = this.todos[index]
			if(entry && (!this.data.project || (this.data.project != null && this.data.project == entry.project))) {
				output.push(`☑️  [${ index }] ${ (entry.project ? `[${ entry.project }] ` : '') }${ entry.task }`)
			}
		}
		console.log(`## ${ output.length } todos:`)
		output.map(line => {
			console.log(line)
		})
		console.log(`to finish a task just enter /todo #[index]`)
	}
}

module.exports = {
	cmd: 'todos',
	description: 'prints a list of all current todos',
	handle: TodosCommand
}