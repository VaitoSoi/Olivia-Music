const { SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Dừng phát nhạc'),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        client.distube.stop(interaction.guild)
            .then(() => interaction.editReply('⏹ Đã dừng phát nhạc'))
            .catch(() => interaction.editReply('😓 Không thể cản bước đài phát thanh'))
    }
}