const { readdirSync } = require("fs")
module.exports = {
    name: "slashcommand",
    category: '管理员',
    description: "重置/删除slash command",
    usage: "slashcommand <remove/reset> [群ID]",
    timeout: 180000,
    run: async (bot, message, args, config) => {
        if (!message.member.permissions.has(['ADMINISTRATOR'])) {
            return message.reply("你打了指令, 可是无法执行, 因为没权限")
        }

        if (args[0] === "reset") {
            if(!args[1]) return message.reply("指令使用方法有误")
            message.channel.send("已收到指令, 正在重置SlashCommand中...")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在重置SlashCommand中...`);

            let all = []
            let fullPermissions = []

            readdirSync("./slash-commands/").map(dir => {
                readdirSync(`./slash-commands/${dir}/`).map(cmd => {
                    let pull = require(`../../slash-commands/${dir}/${cmd}`)
                    let data = {
                        name: pull.name.toLowerCase(),
                        description: pull.description
                    }
                    if (pull.options) {
                        if(pull.options.length === 0) return;
                        data["options"] = pull.options
                    }
                    if (pull.permissions) {
                        if(pull.permissions.length === 0) return;
                        data["defaultPermission"] = false
                    }
                    all.push(data)
                })
            })
            let Choices = all.map(function (cmd) {
                let name = cmd.name
                let value = `cmd_${cmd.name}`
                return {
                    name: name,
                    value: value
                }
            })

            all.forEach(function (element) {
                console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功加載指令 ${element.name}`);
                if (element.name === "help") {
                    if(Choices.length < 25) {
                        element.options[0].choices = Choices
                    }
                }
            })

            try {
                await bot.application.commands.set(all)
            } catch(e) {
                console.log(e)
                return message.reply("重置指令时出错了, 详细情形请看后台")
            }

            message.channel.send("注冊Slash Command 成功! 設置權限中...")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 注冊Slash Command 成功! 設置權限中...`);

            let commands = await bot.application.commands.fetch()
            commands.forEach(async function (command) {
                let pull = bot.slashcommands.get(command.name)
                let temp = new Object()
                if (pull.permissions) {
                    temp.id = command.id
                    temp.permissions = pull.permissions
                    fullPermissions.push(temp)
                }
            })
            try {
                await bot.guilds.cache.get(args[1])?.commands.permissions.set({ fullPermissions });
            } catch (e) {
                return message.reply("設置權限時出錯了")
            }

            message.channel.send("Slash Command 已重置！")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] Slash Command 已重置！`);
        } else if(args[0] === "remove") {
            await message.channel.send("已收到指令, 正在删除SlashCommand中...")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在删除SlashCommand中...`);

            try {
                await bot.application.commands.set([])
            } catch(e) {
                console.log(e)
                return message.reply("删除指令时出错了, 详细情形请看后台")
            }
            message.channel.send("已删除SlashCommand")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功删除SlashCommand, 感谢使用SlashCommand`);
        } else {
            message.reply("指令使用方法有误")
        }
    }
}