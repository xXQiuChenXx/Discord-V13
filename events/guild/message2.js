const Timeout = new Set();
const ms = require('ms')
module.exports=async(bot)=>{
    bot.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        if (interaction.user.bot) return;
        let command = bot.commands.get(interaction.commandName);
        let args = []
        try {
            args = interaction.options.get('args').value.split(" ")
        } catch(e) {

        }
        if(command.timeout){
            if(Timeout.has(`${interaction.user.id}${command.name}`)) {
                return await interaction.reply(`你只能用这个指令每 ${ms(command.timeout)}!`)
            }else{
                console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: /" + interaction.commandName, args === undefined? "": args.join(" "))
                command.run(bot, true, interaction, args);
                Timeout.add(`${interaction.user.id}${command.name}`)
                setTimeout(() => {
                    Timeout.delete(`${interaction.user.id}${command.name}`)
                }, command.timeout);
            }
        }else{
            console.log(`${interaction.user.username}#${interaction.user.discriminator} ` + "执行了指令: /" + interaction.commandName, args === undefined? "": args.join(" "))
            command.run(bot, true, interaction, args);
        }
    });
}