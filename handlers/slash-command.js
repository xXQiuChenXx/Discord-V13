const { readdirSync } = require("fs");
module.exports = async function (bot) {
    readdirSync("./slash-commands/").map(dir => {
        readdirSync(`./slash-commands/${dir}/`).map(cmd => {
            let pull = require(`../slash-commands/${dir}/${cmd}`)
            bot.slashcommands.set(pull.name, pull)
            console.log(`[\x1b[32mSlashCommand\x1b[0m] 成功檢測到指令${pull.name}`)
        })
    })
}