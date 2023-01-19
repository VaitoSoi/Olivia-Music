const { SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Tạm dừng phát nhạc'),
    /**
    * @param {CommandInteraction} interaction
    */ 
    run: async(interaction) => {
        const client = interaction.client
        client.distube.pause(interaction.guild)
            .then(() => interaction.editReply('⏸ Đã tạm dừng phát nhạc'))
            .catch(() => interaction.editReply('🛑 Không thể tạm dừng.'))
    }
}