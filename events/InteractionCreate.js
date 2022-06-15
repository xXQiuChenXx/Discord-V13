const ms = require('ms')
const FakeMessage = require("../libs/FakeMessage")
module.exports = async (bot, interaction, Timeout, config) => {
    if (!interaction.isCommand()) return;
    if (interaction.user.bot) return;
    if (!config["slash_command"]) return;

    let message = new FakeMessage(interaction)
    let command = bot.commands.get(interaction.commandName);
    let args = message.content.split(/ +/)
    args = args.slice(1, args.length)

    if (command.timeout) {
        if (Timeout.has(`${interaction.user.id}_${command.name}`)) {
            return await message.reply(`你只能用这个指令每 ${ms(command.timeout)}!`)
        } else {
            console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: " + `/${interaction.commandName}${interaction.options?._hoistedOptions.map(o => ` ${o.name}: ${o.value}`).join('') || ''}`)
            command.run(bot, message, args, config);
            Timeout.add(`${interaction.user.id}_${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}_${command.name}`)
            }, command.timeout);
        }
    } else {
        console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: " + `/${interaction.commandName}${interaction.options?._hoistedOptions.map(o => ` ${o.name}: ${o.value}`).join('') || ''}`)
        command.run(bot, message, args, config);
    }
}