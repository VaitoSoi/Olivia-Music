const { SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Tiếp tục phát nhạc'),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        client.distube.resume(interaction.guild)
            .then(() => interaction.editReply('▶ Tiếp tục phát nhạc'))
            .catch(() => interaction.editReply('💔 Không thể tiếp tục phát ~~cơm tró~~ nhạc'));
    }
}