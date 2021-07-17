const { readdirSync } = require("fs");
module.exports = (bot) => {
    readdirSync("./commands/").map(dir => {
       readdirSync(`./commands/${dir}/`).map(cmd=>{
           let pull = require(`../commands/${dir}/${cmd}`)
           let Aliases = []; let other = ""
           bot.commands.set(pull.name,pull)
           if(pull.aliases){
               pull.aliases.forEach(p=>{
                   Aliases.push(p)
                   bot.aliases.set(p,pull)
               })
               other = ", 別名為：" + Aliases.join(", ")
           }
           console.log(`✔ 成功加載指令 ${pull.name}${other}`)
       })
    })
}