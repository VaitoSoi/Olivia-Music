import { CommandBuilder } from "../lib/command";
import { EmbedBuilder } from 'discord.js'

export default new CommandBuilder()
    .setName("nowplaying")
    .setDescription("Tạm dừng bài hát hiện tại")
    .setExecute(async (interaction, olivia) => {
        if (!interaction.guild) return;
        const queue = olivia.player.nodes.get(interaction.guild)
        if (!queue) return interaction.editReply('Hàng chờ đang trống :c')
        const track = queue.currentTrack
        if (!track) return;
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${queue.guild.name} - Queue`,
                        iconURL: queue.guild.iconURL() || ''
                    })
                    .setDescription(
                        '**Đã thêm một bài hát:**\n' +
                        '```\n' +
                        track.title +
                        '```'
                    )
                    .setColor('Random')
                    .setThumbnail(track.thumbnail)
                    .addFields(
                        { name: `🤵‍♂️ Tác giả`, value: `${track.author}`, inline: true },
                        { name: '⌛ Thời lượng', value: `${track.duration}`, inline: true },
                        { name: '🎶 Nguồn', value: `${track.source.toUpperCase()}`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `${olivia.client.user?.tag}`,
                        iconURL: olivia.client.user?.avatarURL() || ''
                    })
            ]
        })
    })