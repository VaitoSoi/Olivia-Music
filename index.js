const { Client, Partials, IntentsBitField } = require('discord.js')
const client = new Client({
    partials: [Partials.Message, Partials.Reaction, Partials.User],
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})
client.slash = {}

const { DisTube } = require('distube')
const { DeezerPlugin } = require('@distube/deezer')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const distube = new DisTube(client, {
    leaveOnEmpty: true,
    plugins: [
        new DeezerPlugin(),
        new SoundCloudPlugin(),
        new SpotifyPlugin()
    ]
})
client.distube = distube

const dotenv = require('dotenv')
dotenv.config({ path: './.env', encoding: 'utf8' })
process.env.TZ = 'Asia/Ho_Chi_Minh'

require('./handler/event')(client)

module.exports.message = []

const chalk = require('chalk')
client.login(process.env.TOKEN)
    .then(console.log(chalk.green('[DISCORD.JS] Logined')))
    .catch((e) => {
        console.error(chalk.red('[DISCORD.JS] Login error: ' + e))
        process.exit(0)
    })