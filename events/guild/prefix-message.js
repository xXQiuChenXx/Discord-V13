const ms = require('ms')
module.exports = async(bot, message, Timeout, config)=> {
    let prefix = config.prefix

    if (message.author.bot) return;
    if (config["prefix_command"] === false) return;
    if (!message.content.toLowerCase().startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);
    if (!message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = bot.commands.get(cmd);
    if (!command) command = bot.aliases.get(cmd);

    if (command) {
        if (command.timeout) {
            if (Timeout.has(`${message.author.id}${command.name}`)) {
                return message.reply(`你只能用这个指令每 ${ms(command.timeout)}!`)
            } else {
                console.log(`${message.member.user.tag} ` + "执行了指令:", message.content)
                command.run(bot, message, args, config);
                Timeout.add(`${message.author.id}${command.name}`)
                setTimeout(() => {
                    Timeout.delete(`${message.author.id}${command.name}`)
                }, command.timeout);
            }
        } else {
            console.log(`${message.member.user.tag} ` + "执行了指令:", message.content)
            command.run(bot, message, args, config)
        }
    }
}
