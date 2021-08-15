const { readdirSync } = require("fs")
async function Reset(bot, interaction, config) {
    await interaction.deferReply()
    if (!interaction.member.permissions.has(['ADMINISTRATOR'])) {
        return interaction.editReply("你打了指令, 可是无法执行, 因为没权限")
    }
    let type = interaction.options.get("type").value
    if (type === "c_reset") {
        console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在重置SlashCommand中...`);
        await interaction.editReply("已收到指令, 正在重置SlashCommand中...")
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
                    data["options"] = pull.options
                }
                if (pull.permissions) {
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
        console.log(`[\x1b[32mSlashCommand\x1b[0m] 注冊Slash Command 成功! 設置權限中...`);
        interaction.editReply("注冊Slash Command 成功! 設置權限中...")
        await bot.application?.commands.set(all)

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
        await bot.guilds.cache.get(config.GUILD_ID)?.commands.permissions.set({ fullPermissions });

        console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功注冊指令!`);
        interaction.editReply("Slash Command 已重置, 請等待幾分鐘后生效")
    } else if (type === "c_delete") {
        console.log(`[\x1b[32mSlashCommand\x1b[0m] 已收到指令, 正在刪除SlashCommand中...`);
        await interaction.editReply("已收到指令, 正在刪除SlashCommand中...")

        try {
            await bot.application?.commands.set([])
        } catch (e) {
            console.error(e)
            return interaction.editReply("出錯了，請檢查後臺以獲取詳細資料")
        }

        console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功刪除指令!`);
        interaction.editReply("Slash Command 已刪除, 感謝使用Slash Command")
    }
}

module.exports = {
    name: "slashcommand",
    category: '管理员',
    description: "管理SlashCommand",
    usage: "/slashcommand <reset/delete>",
    timeout: 180000,
    permissions: [],
    options: [{
        name: 'type',
        type: 'STRING',
        description: '重置指令或刪除全部指令',
        required: true,
        choices: [
            {
                name: 'reset',
                value: 'c_reset',
            },
            {
                name: 'delete',
                value: 'c_delete',
            },
        ],
    }],
    run: Reset
}