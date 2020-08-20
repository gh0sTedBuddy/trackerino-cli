const moment = require('moment')

function ProjectCommand (_input, _instance) {
	if(_input) {
		console.log(`set project to ${ _input }`)
		let proj = this.projectsList.filter(project => {
			return project.name.toLowerCase() === _input.toLowerCase()
		})
		if(proj.length > 0) {
			proj = proj.shift()
			this.data.project = proj.name
		} else {
			this.projectsList.push({
				name: _input,
				amount: 0.0
			})
			this.data.project = _input
		}
	} else {
		this.data.project = null
	}
}

module.exports = {
	cmd: 'project',
	description: 'sets project or starts dialog for creating new project',
	handle: ProjectCommand
}