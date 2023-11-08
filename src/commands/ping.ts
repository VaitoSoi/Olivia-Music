import { CommandBuilder } from "../lib/command";
import { CommandInteraction } from 'discord.js'

export default new CommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot')
    .setExecute((interaction: CommandInteraction, olivia) => {
        void interaction.editReply({
            content: `🏓 pong after ${olivia.client.ws.ping}ms`
        })
    })