function TodoCommand (_input, _instance) {
	let project = this.options.storage.get('project', null)
	let todos = this.options.storage.get('todos', [])
	this.say(`➕ add todo: ${ _input } with index ${ todos.length }`)

	todos.push({
		project: project,
		task: _input
	})

	this.options.storage.set('todos', todos)

	this.say(`- to finish this task, you just need to enter /done ${ todos.length - 1 }`)
}

module.exports = {
	cmd: 'todo',
	description: 'adds a new task to your todo list.',
	handle: TodoCommand
}