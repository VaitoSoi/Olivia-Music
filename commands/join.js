const { SlashCommandBuilder, CommandInteraction, ChannelType } = require('discord.js')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Vào một kênh âm thanh chỉ định')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Kênh âm thanh muốn bot vào')
            .addChannelTypes(ChannelType.GuildVoice)
        ),
    /**
    * @param {CommandInteraction} interaction
    * @param {DisTube} distube
    */ 
    run: async(interaction, distube) => {
        const client = interaction.client
        const queue = distube.getQueue(interaction.guild)
        if (queue?.playing) return interaction.editReply('🎶 Đài phát thanh đang phát nhạc')
        const id = interaction.options.get('channel')?.value ?? interaction.member.voice?.channel?.id
        if (!id) return interaction.editReply('🛑 Thiếu channel')
        const channel = interaction.guild.channels.cache.get(id)
        if (channel.type != ChannelType.GuildVoice) return
        distube.voices.join(channel)
            .catch(() => interaction.editReply('🛑 Không thể vào kênh chỉ định.'))
            .then((voice) => interaction.editReply(`✅ Đã vào kênh <#${voice.channelId}>`))
    }
}