const { cloudflare } = require('./config.json');

const underscoreDiscordDomain = `_discord.${cloudflare.domain}`;

module.exports = {underscoreDiscordDomain};