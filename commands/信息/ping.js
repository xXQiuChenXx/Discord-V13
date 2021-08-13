const Discord = require('discord.js')
module.exports = {
    name: "ping",
    category: '信息',
    description: "返回延迟和API 延迟",
    timeout: 10000,
    run: async (bot, message, args, config) => {
        message.reply(`🏓 Pinging....`).then(async msg => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Pong!')
                .setDescription(`🏓 Pong!\n延迟为 ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI延迟为 ${Math.round(bot.ws.ping)}ms`)
                .setColor('RANDOM')
            msg.edit("\u200B")
            msg.edit({ embeds: [embed] })
        })
    }
}