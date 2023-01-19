const { Client, Events } = require('discord.js')
const chalk = require('chalk')

module.exports = {
    name: Events.ClientReady,
    once: false,
    distube: false,
    /**
     * @param {Client} client 
     */
    run (client) {
        console.log(chalk.green(`[DISCORD.JS] Login as ${client.user.tag}`))
        require('../handler/command')(client)
    }
}