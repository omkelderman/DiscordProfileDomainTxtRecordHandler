const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getExistingRecordIdForDiscordUser, addTxtRecordForUser, hasExistingRecordIdForContent } = require('../cloudflare');
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
        const txtRecord = interaction.options.getString('txt-record');
        if (!txtRecord) {
            await interaction.reply('Error: no txt record given :(');
            return;
        }

        const recordId = await getExistingRecordIdForDiscordUser(interaction.user);
        if (recordId) {
            console.log(`user ${interaction.user.tag} requested TXT record ${txtRecord} but already has one, so denied`)
            interaction.reply('You already have a TXT record, you can remove it with /del-txt-record');
            return;
        }

        if(await hasExistingRecordIdForContent(txtRecord)) {
            console.log(`user ${interaction.user.tag} requested TXT record ${txtRecord} but a TXT record with that content already exists`)
            interaction.reply('Unable to add TXT record, one with that content already exists, but is not registered to you?');
            return;
        }

        await addTxtRecordForUser(interaction.user, txtRecord);

        console.log(`TXT record '${txtRecord}' added for user ${interaction.user.tag}`)
        await interaction.reply('Done!');
    }
};