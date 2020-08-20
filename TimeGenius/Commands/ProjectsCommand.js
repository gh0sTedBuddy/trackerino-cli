function ProjectsCommand (_input, _instance) {
	this.projectsList.map(project => {
		let output = []
		if(project.name.toLowerCase() === this.data.project.toLowerCase()) {
			output.push('[\x1b[36mX\x1b[0m]')
		} else {
			output.push('[ ]')
		}

		output.push(`${ '\x1b[32m' }${ project.amount.toFixed(2) }${ '\x1b[0m' }`)
		output.push(project.name)

		this.say(output.join("\t"))
	})
}

module.exports = {
	cmd: 'projects',
	description: 'prints a list of all current projects',
	handle: ProjectsCommand
}