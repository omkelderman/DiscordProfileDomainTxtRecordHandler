const { User } = require('discord.js');
const { cloudflare } = require('./config.json');
const { underscoreDiscordDomain } = require('./globalConstants');

const CF = require('cloudflare');
const cf = new CF({ token: cloudflare.token });


/**
 * @param {User} user
 * @returns {Promise<string|undefined>}
 */
async function getExistingRecordIdForDiscordUser(user) {
    const existingRecordsResponse = await cf.dnsRecords.browse(cloudflare.zoneId, { type: 'TXT', name: underscoreDiscordDomain });
    if (!existingRecordsResponse.success) throw new Error('Cloudflare API Error');

    const foundRecord = existingRecordsResponse.result.find(x => x.comment.startsWith(`[DiscordID=${user.id}]`));
    return foundRecord?.id;
}

/**
 * @param {string} content
 */
async function hasExistingRecordIdForContent(content) {
    const existingRecordsResponse = await cf.dnsRecords.browse(cloudflare.zoneId, { type: 'TXT', name: underscoreDiscordDomain, content });
    if (!existingRecordsResponse.success) throw new Error('Cloudflare API Error');

    return existingRecordsResponse.result.length > 0;
}

/**
 * @param {string} recordId
 */
async function deleteTxtRecord(recordId) {
    await cf.dnsRecords.del(cloudflare.zoneId, recordId);
}

/**
 * @param {User} user
 * @param {string} txtRecordContent
 */
async function addTxtRecordForUser(user, txtRecordContent) {
    await cf.dnsRecords.add(cloudflare.zoneId, {
        type: 'TXT',
        name: underscoreDiscordDomain,
        content: txtRecordContent,
        comment: `[DiscordID=${user.id}] ${user.displayName} (${user.tag})`
    });
}

module.exports = { getExistingRecordIdForDiscordUser, hasExistingRecordIdForContent, deleteTxtRecord, addTxtRecordForUser }