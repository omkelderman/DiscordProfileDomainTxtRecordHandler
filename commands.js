const commands = [
    require('./commands/set-txt-record'),
    require('./commands/del-txt-record'),
]


module.exports = new Map(commands.map(x => [x.command.name, x]))