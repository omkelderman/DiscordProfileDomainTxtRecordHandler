const { Client, Events, GatewayIntentBits } = require('discord.js');
const { discord: {token: discordToken} } = require('./config.json');
const commands = require('./commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.exec(interaction);
    } catch (err) {
        console.error(err);
        const errorResponse = { content: 'There was an error while executing this command!', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorResponse);
        } else {
            await interaction.reply(errorResponse);
        }
    }
});

client.on('error', err => {
    console.error(err);
});

client.login(discordToken);
