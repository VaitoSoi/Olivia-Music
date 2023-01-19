const { Client, REST, Routes } = require('discord.js')
const fs = require('fs')
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
const chalk = require('chalk')

/**
 * @param {Client} client 
 * @returns {void}
 */
module.exports = (client) => {
    let commands = []
    fs.readdirSync('./commands/')
        .filter((file) => file.endsWith('.js'))
        .forEach((file) => {
            const cmd = require('../commands/' + file)
            if (!cmd.data || !cmd.run) return console.error(chalk.red(`file ${file} miss data or run function`))
            commands.push(cmd.data.toJSON())
            client.slash[cmd.data.name] = cmd
        });
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
            console.log(chalk.green(`[DISCORD.JS] Registered ${commands.length} slash commands`))
        } catch (e) {
            console.error(chalk.red(`[DISCORD.JS] Register error: ${e}`))
        }
    })()
}