const DebugCmd = require('./DebugCommand')
const DeleteCmd = require('./DeleteCommand')
const DoneCmd = require('./DoneCommand')
const ExportCmd = require('./ExportCommand')
const HelpCmd = require('./HelpCommand')
const NowCmd = require('./NowCommand')
const ProjectCmd = require('./ProjectCommand')
const ProjectsCmd = require('./ProjectsCommand')
const SetStartCmd = require('./SetStartCommand')
const SetTimeCmd = require('./SetTimeCommand')
const SyncCmd = require('./SyncCommand')
const TasksCmd = require('./TasksCommand')
const TodayCmd = require('./TodayCommand')
const TodoCmd = require('./TodoCommand')
const TodosCmd = require('./TodosCommand')
const UpdateCmd = require('./UpdateCommand')
const ListsCmd = require('./ListsCommand')
const ListCmd = require('./ListCommand')
module.exports = {
	DebugCmd,
	DeleteCmd,
	NowCmd,
	SetStartCmd,
	SetTimeCmd,
	SyncCmd,
	ExportCmd,
	HelpCmd,

	ProjectCmd, ProjectsCmd,
	TasksCmd,
	UpdateCmd,
	TodayCmd,
	TodoCmd, TodosCmd, DoneCmd,
	ListsCmd, ListCmd
}