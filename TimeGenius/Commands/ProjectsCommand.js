const fs = require('fs')
const moment = require('moment')
function ProjectsCommand (_input, _instance) {
	if(!!_input) {
		let tasks = []
		let files = this.getAllFiles()
		for(let _index = 0; _index < files.length; _index++) {
			try {
				let content = fs.readFileSync(`${ this.data.path }/${ files[_index] }`)
				content = JSON.parse(content)
				if(!!content && !!content.tasks && content.tasks.length > 0) {
					let dayTasks = content.tasks.filter(task => !!task && !!task.project && task.project.toLowerCase() === _input.toLowerCase())
					tasks = [...tasks, ...dayTasks]
					let dayAmount = dayTasks.reduce((v,t) => v+t.amount, 0)
					if(dayAmount > 0) {
						this.say(`${ moment.unix(content.started_at).format(this.dateFormat) } (${ dayTasks.length }): ${ dayAmount.toFixed(2) } hours`)
					}
				}
			} catch(err) {
				this.logError(err)
			}
		}

		if(tasks.length > 0) {
			let _amount = tasks.reduce((v,t) => v + t.amount, 0.0)
			this.say(`${ _input } => ${ _amount.toFixed(2) }`)
		}
	} else {
		this.projectsList.map(project => {
			if(!project || !project.name) return
			let output = []
			if(this.data.project && project.name.toLowerCase() === this.data.project.toLowerCase()) {
				output.push('[\x1b[36mX\x1b[0m]')
			} else {
				output.push('[ ]')
			}

			output.push(`${ '\x1b[32m' }${ project.amount.toFixed(2) }${ '\x1b[0m' }`)
			output.push(project.name)

			this.say(output.join("\t"))
		})
	}
}

module.exports = {
	cmd: 'projects',
	description: 'prints a list of all current projects',
	handle: ProjectsCommand
}