const ms = require('ms')
module.exports = async (bot, interaction, Timeout, config) => {
    if (!interaction.isCommand()) return;
    if (interaction.user.bot) return;
    if (config["slash_command"] === false) return;

    let command = bot.slashcommands.get(interaction.commandName);

    if (command.timeout) {
        if (Timeout.has(`${interaction.user.id}${command.name}`)) {
            return await interaction.reply(`你只能用这个指令每 ${ms(command.timeout)}!`)
        } else {
            console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: " + `/${interaction.commandName}${interaction.options?._hoistedOptions.map(o => ` ${o.name}: ${o.value}`).join('') || ''}`)
            command.run(bot, interaction, config);
            Timeout.add(`${interaction.user.id}${command.name}`)
            setTimeout(() => {
                Timeout.delete(`${interaction.user.id}${command.name}`)
            }, command.timeout);
        }
    } else {
        console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: " + `/${interaction.commandName}${interaction.options?._hoistedOptions.map(o => ` ${o.name}: ${o.value}`).join('') || ''}`)
        command.run(bot, interaction, config);
    }
}