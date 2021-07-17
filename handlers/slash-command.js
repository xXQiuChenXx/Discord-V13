const { readdirSync } = require("fs");
module.exports = async function (bot) {
    let all = []
    readdirSync("./commands/").map(dir => {
       readdirSync(`./commands/${dir}/`).map(cmd=>{
           let pull = require(`../commands/${dir}/${cmd}`)
           let data = {
               name: pull.name.toLowerCase(),
               description: pull.description,
               options: [{
                name: 'args',
                type: 'STRING',
                description: 'args',
                required: false,
            }]
        }
        all.push(data)
       })
    })
    await bot.application?.commands.set(all);
}