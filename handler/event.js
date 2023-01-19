const { Client } = require('discord.js')
const fs = require('fs')
const chalk = require('chalk')

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    fs.readdirSync('./events')
        .filter((file) => file.endsWith('.js'))
        .forEach(file => {
            const event = require('../events/' + file)
            if (!event.name || !event.run) return console.error(chalk.red(`file ${file} miss data or run function`))
            if (event.distube === true) {
                event.once === true ?
                    client.distube.once(event.name, (...args) => event.run(...args)) :
                    client.distube.on(event.name, (...args) => event.run(...args))
            } else {
                event.once === true ?
                    client.once(event.name, (...args) => event.run(...args)) :
                    client.on(event.name, (...args) => event.run(...args))
            }
        })
    console.log(chalk.green('[DISCORD.JS] Events ready'))
}