function TodoCommand (_input, _instance) {
	this.say(`➕ add todo: ${ _input } with index ${ this.todos.length }`)

	if(!this.todos) this.todos = []

	this.todos.push({
		project: this.data.project,
		task: _input
	})

	this.say(`- to finish this task, you just need to enter /done ${ this.todos.length - 1 }`)
}

module.exports = {
	cmd: 'todo',
	description: 'adds a new task to your todo list.',
	handle: TodoCommand
}