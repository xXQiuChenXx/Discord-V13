const Discord = require('discord.js')
module.exports = {
    name: "ping",
    category: '信息',
    description: "查看機器人與Discord的延遲",
    usage: "ping",
    timeout: 5000,
    run: async (bot, interaction, config) => {
        interaction.reply(`🏓 Pinging....`)
        interaction.fetchReply()
            .then(reply => {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Pong!')
                    .setDescription(`🏓 Pong!\n延遲為 ${Math.floor(reply.createdTimestamp - interaction.createdTimestamp)}ms\n機器人API延遲為 ${Math.round(bot.ws.ping)}ms`)
                    .setColor('RANDOM')
                interaction.editReply("\u200B")
                interaction.editReply({ embeds: [embed] })
            })
    }
}