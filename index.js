const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ]
});
const config = require("./config.json")
const token = config.token;
const fs = require('fs')
const Timeout = new Set();
bot.prefix = config.prefix;
bot.commands = new Collection();
bot.slashcommands = new Collection();
bot.aliases = new Collection();
if (config["prefix_command"] === true) {
    bot.categories = fs.readdirSync("./commands/");
    require(`./handlers/prefix-command`)(bot);
}
if (config["slash_command"] === true) {
    bot.slashcommands.categories = fs.readdirSync("./slash-commands/");
    require("./handlers/slash-command")(bot)
}
bot.on('ready', () => {
    require('./events/client/ready')(bot)
    bot.user.setPresence({ activities: [{ name: `${config.prefix}help 來獲取幫助` }], status: 'online' });
})

bot.on('messageCreate', async message => {
    require('./events/guild/prefix-message')(bot, message, Timeout, config)
})

bot.on('interactionCreate', async interaction => {
    require("./events/guild/slash-message")(bot, interaction, Timeout, config)
});

bot.login(token)
