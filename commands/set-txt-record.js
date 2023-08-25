const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getExistingRecordIdForDiscordUser, addTxtRecordForUser } = require('../cloudflare');
const { underscoreDiscordDomain } = require('../globalConstants');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('set-txt-record')
        .setDescription(`Add a TXT record on ${underscoreDiscordDomain} to make it a verified domain on your discord profile`)
        .addStringOption(option =>
            option
                .setName('txt-record')
                .setDescription('The full TXT record discord gives you when trying to add the domain to your profile')
                .setRequired(true)
        )
    ,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async exec(interaction) {
        const recordId = interaction.options.getString('txt-record');
        if (!recordId) {
            await interaction.reply('Error: no txt record given :(');
            return;
        }

        const hasRecord = await getExistingRecordIdForDiscordUser(interaction.user);
        if (hasRecord) {
            interaction.reply('You already have a TXT record, you can remove it with /del-txt-record');
            return;
        }

        await addTxtRecordForUser(interaction.user, recordId);

        await interaction.reply('Done!');
    }
};