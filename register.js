const { REST, Routes } = require('discord.js');
const { discord } = require('./config.json');
const commands = [...require('./commands').values()].map(x => x.command.toJSON());

async function registerCommands() {
    const rest = new REST().setToken(discord.token);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationGuildCommands(discord.applicationId, discord.guildId), {body: commands});
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch(err) {
        console.error(err);
    }
}
registerCommands();