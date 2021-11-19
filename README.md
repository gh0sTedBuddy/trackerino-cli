# trackerino

A simple command line tool to track your time and create json files out of your days.

Basically this is my companion for the last few years. I am tracking everything i'm doing throughout the day while i'm at my computer.

trackerino isn't judging you for what you do, it just asks you, what you've done and you're free to answer this simple question.

## Installation

Simple:

- clone this repository `git clone git@github.com:bennigames/trackerino-cli.git`
- navigate into the new directory `cd trackerino-cli`
- install dependencies `npm install`
- and link the app `npm link`

This will install trackerino as an global command within your command line and you're now free to start trackerino's process by typing `trackerino`.

## Usage

You can just answer, what you've done or you can enter various simple commands. Like:

- `/now` – shows the current date
- `/today [project name]` – gives you a summary of your current day. the project name is optional so you could list all entries regarding the entered project
- `/idle` – enters a break or idle time
- `/started [HH:MM]` – sets the started time to the entered time (i.e. `10:00` sets the time you started trackerino to 10:00 am)
- `/set [HH:MM]` – sets the current time to the entered time (i.e. `13:00` sets the time to 01:00 pm)
- `/realtime` – sets the current time to realtime
- `/categories` - lists all saved categories
- `/category [category name]` - switches the current category space to the entered category. if no category is entered the space gets emptied
- `/project [project name]` – will switch your tasks/todos space to the entered project
- `/projects` – lists all saved projects
- `/help` – lists all available commands

By answering the question (without a command) trackerino will save your input as a new accomplished task calculates the time since the last task was finished and calculates your working hours for this particular task.

Each created entity gets its own unique identifier which can be used as a command. For example when you create a new todo with `/todo my todo` this will be created and when you enter `/todos` you'll see something like:

```
	## 1 todos:
	☑️  [rspGHEkwb] my todo
	to finish a task just enter /[id].done
```

and with `/rspGHEkwb.done` you could finish up the todo `my todo`.

If you want to delete an entity, you just enter `/rspGHEkwb.delete rspGHEkwb`. You'll have to repeat the id as a parameter so trackerino is sure you're serious about the deleting process otherwise it would ask you to do so (i made terrible mistakes without this parameter so i added it as a safety net).

## It's about time

As soon as you start trackerino with your command `trackerino` the current timestamp gets saved as the current time and if it is your first time you're starting trackerino today your starting time gets set to the same timestamp.

If you want to start to set the started timestamp to a specific time just enter `/started 10:00` and it will be set to 10:00 am.

When you want to set the current time to an earlier time just enter `/set 09:00` and with that the flag `isRealtime` will be set to false so trackerino will stay at 09:00 am until you enter `/realtime` which causes trackerino to set itself back to the real time.