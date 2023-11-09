import { CommandBuilder } from "../lib/command";
import { CommandInteraction } from 'discord.js'

export default new CommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot')
    .setExecute(async (interaction: CommandInteraction, olivia) => {
        if (!interaction.guild) return
        const queue = olivia.player.nodes.get(interaction.guild)
        const msg = await interaction.editReply({ content: '⌛ Checking....' })
        void interaction.editReply({
            content: 
                '**---------- Olivia Latency ----------**\n' +
                `🏓 WS: ${olivia.client.ws.ping}ms\n` +
                `🤖 Bot: ${msg.createdTimestamp - interaction.createdTimestamp}ms\n` +
                `🔊 Voice: ${`${queue?.ping}ms` || 'Empty queue :c'}`
        })
    })