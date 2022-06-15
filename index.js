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
const fs = require('fs')
const Timeout = new Set();
bot.prefix = config.prefix_command === true ? config.prefix : "/";
bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");

require(`./handlers/commandHandle`)(bot);

bot.on('ready', () => {
    require('./events/ready')(bot)
    bot.user.setPresence({ activities: [{ name: `${bot.prefix}help 來獲取幫助` }], status: 'online' });
})

bot.on('messageCreate', async message => {
    require('./events/messageCreate')(bot, message, Timeout, config)
})

bot.on('interactionCreate', async interaction => {
    require("./events/interactionCreate")(bot, interaction, Timeout, config)
});

bot.login(config.token)
