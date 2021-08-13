const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const ms = require('ms');
module.exports = {
    name: "help",
    category: "info",
    description: "幫助列表",
    usage: "/help <showall/all/name> [指令]",
    options: [
    {
        name: 'command',
        type: 'STRING',
        description: '指令名字',
        required: false
    }],
    run: async (bot, interaction, config) => {
        let name = interaction.options.get("command")
        if (name) {
            getCMD(bot, interaction, name);
        } else {
            getAll(bot, interaction);
        }
    }
}

function getAll(bot, interaction) {
    const commands = (category) => {
        return bot.slashcommands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join(" ");
    }

    const info = bot.slashcommands.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(info)

    return interaction.reply({ embeds: [embed] });
}

function getCMD(bot, interaction, input) {
    const embed = new MessageEmbed()

    const cmd = bot.slashcommands.get(input.toLowerCase());

    let info = `沒有找到指令 **${input.toLowerCase()}**`;

    if (!cmd) {
        embed.setColor("RANDOM").setDescription(info)
        return interaction.editReply({ embeds: [embed] });
    }

    if (cmd.name) info = `**指令名字**: ${cmd.name}`;
    if (cmd.description) info += `\n**描述**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**用法**: ${cmd.usage}`;
        embed.setFooter(`提示: <> = 必须, [] = 可选`);
    }
    if (cmd.timeout) info += '\n**冷卻**: ' + ms(cmd.timeout)
    embed.setColor("RANDOM")
        .setDescription(info)
    return interaction.reply({ embeds: [embed] });
}