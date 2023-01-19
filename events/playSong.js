const { Events, Song, Queue } = require('distube')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: Events.PLAY_SONG,
    distube: true,
    once: false,
    /**
     * @param {Queue} queue 
     * @param {Song} song 
     */
    async run(queue, song) {
        /**
         * @param {String} source
         * @returns {String}
         */
        const source = (source) => {
            let output = '';
            switch (source) {
                case 'youtube': output = '<:youtube:980437302633463808> YouTube'; break
                case 'spotify': output = '<:spotify:980437591285432400> Spotify'; break
                case 'soundcloud': output = '<:soundcloud:980437924103454750> SoundCloud'; break
                default: output = source
            }
            return output
        }
        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: queue.textChannel.guild.iconURL(),
                name: 'Bài hát đang phát tại ' + queue.textChannel.guild.name
            })
            .setDescription(`\`\`\`${song.name}\`\`\``)
            .addFields(
                { name: '🤵 Tác giả', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
                { name: '⏳ Thời lượng', value: song.formattedDuration, inline: true },
                { name: '🎼 Nguồn', value: source(song.source), inline: true },
            )
            .setColor('Random')
            .setImage(song.thumbnail)
            .setTimestamp()
            .setFooter({
                text: `Yêu cầu bởi: ${song.user.tag}`,
                iconURL: song.user.displayAvatarURL()
            })
        if (song.playlist) {
            embed.addFields(
                { name: '📃 Tên Playlist', value: `[${song.playlist.name}](${song.playlist.url})`, inline: true },
                { name: '🎶 Số lượng bài hát', value: `${song.playlist.songs.length} bài hát`, inline: true },
                { name: '⏳ Thời lượng', value: `${song.playlist.formattedDuration}`, inline: true }
            )
        }
        const components = [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setEmoji('⏹')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setEmoji('⏮')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pause')
                        .setEmoji('⏸')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setEmoji('⏭')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shuffle')
                        .setEmoji('🔀')
                        .setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('queue')
                        .setEmoji('📃')
                        .setLabel('Queue')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('setting')
                        .setEmoji('⚙')
                        .setLabel('Cài đặt')
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete')
                        .setEmoji('🗑')
                        .setLabel('Xóa tin nhắn')
                        .setStyle(ButtonStyle.Danger)
                )
        ]
        require('../index').message.push({
            guild: queue.textChannel.guild.id,
            message: (await queue.textChannel.send({ embeds: [embed], components })).id
        })
    }
}