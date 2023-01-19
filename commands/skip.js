const { SlashCommandBuilder, CommandInteraction } = require('discord.js')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Nhảy tới một bài hát chỉ định')
        .addNumberOption(option => option
            .setName('position')
            .setDescription('Vị trí bài hát muốn nhảy đến')
        ),
    /**
    * @param {CommandInteraction} interaction
    * @param {DisTube} distube
    */
    run: async (interaction, distube) => {
        const client = interaction.client
        const pos = interaction.options.get('position')?.value || 1
        distube.jump(interaction.guild, pos)
            .then(song => interaction.editReply(`⏭ Đã nhảy tới bài \`${song?.name ?? 'null'}\``))
            .catch(() => interaction.editReply('🛑 Vị trí không hợp lệ'))

    }
}