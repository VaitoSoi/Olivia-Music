const { SlashCommandBuilder, CommandInteraction } = require('discord.js')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Xáo trộn hàng chờ'),
    /**
    * @param {CommandInteraction} interaction
    * @param {DisTube} distube
    */
    run: async (interaction, distube) => {
        const client = interaction.client
        distube.shuffle(interaction.guild)
            .then(() => interaction.editReply('🔀 Đã xáo hàng chờ'))
            .catch(() => interaction.editReply('😓 Không thể xáo hàng chờ'))
    }
}