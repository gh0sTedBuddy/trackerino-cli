# TimeGenius

A simple node.js program to track your time and create json files out of your days.

Basically this is my companion for tracking everything i'm doing throughout the days while i'm at my computer. Is it actual work or just writing down when i'm chillin' or doing whatever.

TimeGenius isn't judging you for what you do it just asks you, what you've done and you're free to answer this simple question.

## Installation

Simple:

- clone this repository `git clone git:blabla`
- navigate into TimeGenius directory `cd TimeGenius`
- install `npm install`
- and link `npm link`

This will install TimeGenius as an global command within your command line and you're now free to start TimeGenius' process by typing `TimeGenius`.

## Usage

You can just answer, what you've done or you can enter various simple commands. Like:

- `/tasks` – lists all entered tasks for today
- `/today [project name]` – gives you a summary of your current day. if you enter an project name it will only show entries regarding your stated project
- `/todo [your actual todo]` – saves your todo to the system
- `/project [project name]` – will switch your tasks/todos space to the entered project
- `/quit` – obvious
- `/now` – shows the current date
- `/update [index] [correction] [description]` – updates the entered task whilst `description` is an optional input you can correct the specified time for that specific task
- `/todos` – lists all current saved todos. if you switched to an project it will only show the project specific todos you saved earlier
- `/projects` – lists all current saved projects
- `/done [index]` – finishes an todo and saves it as your current finished task. (it will keep the given project of the saved todo so you can finish tasks while inside another project)

By answering the question (without an command) TimeGenius will save your input as a new accomplished task calculates the time since the last task was finished and calculates your working hours for this particular task.
