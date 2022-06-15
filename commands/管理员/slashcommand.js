const { readdirSync } = require("fs")
module.exports = {
    name: "slashcommand",
    category: '管理员',
    description: "重置/删除slash command",
    usage: "slashcommand <remove/reset> [群ID]",
    timeout: 180000,
    options: [{
        name: '種類',
        type: 'STRING',
        description: '重置指令或刪除全部指令',
        required: true,
        choices: [
            {
                name: 'reset',
                value: 'reset',
            },
            {
                name: 'delete',
                value: 'delete',
            },
        ],
    }],
    permissions: [],
    run: async (bot, message, args, config) => {
        if (!message.member.permissions.has(['ADMINISTRATOR'])) {
            return message.reply("你打了指令, 可是无法执行, 因为没权限")
        }

        if (args[0] === "reset") {
            message.channel.send("已收到指令, 正在重置SlashCommand中...")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在重置SlashCommand中...`);

            let all = []
            let fullPermissions = []

            readdirSync("./commands/").map(dir => {
                readdirSync(`./commands/${dir}/`).map(cmd => {
                    let pull = require(`../../commands/${dir}/${cmd}`)
                    let data = {
                        name: pull.name.toLowerCase(),
                        description: pull.description
                    }
                    if (pull.options) {
                        if (pull.options.length !== 0) data["options"] = pull.options
                    }
                    if (pull.permissions) {
                        if (pull.permissions.length !== 0) data["defaultPermission"] = false
                    }
                    all.push(data)
                })
            })
            let Choices = all.map(function (cmd) {
                let name = cmd.name
                let value = `${cmd.name}`
                return {
                    name: name,
                    value: value
                }
            })

            all.forEach(function (element) {
                console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功加載指令 ${element.name}`);
                if (element.name === "help") {
                    if (Choices.length < 25) {
                        element.options[0].choices = Choices
                    }
                }
            })

            try {
                await bot.application.commands.set(all)
            } catch (e) {
                console.log(e)
                return message.reply("重置指令时出错了, 详细情形请看后台")
            }

            message.channel.send("注冊Slash Command 成功!")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 注冊Slash Command 成功!`);

            if (args[1]) {
                message.channel.send("設置權限中...")
                console.log(`[\x1b[32mSlashCommand\x1b[0m] 設置權限中...!`)
                let commands = await bot.application.commands.fetch()
                commands.forEach(async function (command) {
                    let pull = bot.commands.get(command.name)
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
            }

            message.channel.send("Slash Command 已重置！")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] Slash Command 已重置！`);
        } else if (args[0] === "delete") {
            await message.channel.send("已收到指令, 正在删除SlashCommand中...")
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在删除SlashCommand中...`);

            try {
                await bot.application.commands.set([])
            } catch (e) {
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