const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getExistingRecordIdForDiscordUser, deleteTxtRecord } = require('../cloudflare');
const { underscoreDiscordDomain } = require('../globalConstants');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('del-txt-record')
        .setDescription(`Remove a TXT record on ${underscoreDiscordDomain} previously added by this bot`)
    ,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async exec(interaction) {
        const recordId = await getExistingRecordIdForDiscordUser(interaction.user);
        if (!recordId) {
            interaction.reply('You do not have a TXT record added by this bot');
            return;
        }

        await deleteTxtRecord(recordId);

        await interaction.reply('Done!');
    }
};