const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require("./config.json")
const prefix = config.prefix;
const token = config.token;
const fs = require('fs')
bot.prefix = prefix;
bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");
if (config["prefix_command"] === true) {
    require(`./handlers/command`)(bot);
}
bot.on('ready', () => {
    if (config["slash_command"] === true) {
        require("./handlers/slash-command")(bot)
        require("./events/guild/message2")(bot)
    }
    require('./events/client/ready')(bot)
    bot.user.setPresence({ activities: [{ name: `${prefix}help 來獲取幫助` }], status: 'online' });
})
bot.on('messageCreate', async message => {
    require('./events/guild/message')(bot, message)
})

bot.login(token)
