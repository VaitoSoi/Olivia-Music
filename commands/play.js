const { CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát một bài hát bằng tên hoặc link')
        .addStringOption(option => option
            .setName('query')
            .setDescription('Tên hoặc Link của bài hát')
            .setRequired(true)
        ),
    /**
    * @param {CommandInteraction} interaction
    * @param {DisTube} distube
    */
    run: async (interaction, distube) => {
        const client = interaction.client
        const member = interaction.guild.members.cache.get(interaction.user.id)
        const voice = member.voice?.channel
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
        if (voice) {
            distube.play(voice, interaction.options.get('query')?.value, {
                member, textChannel: interaction.channel
            })
            distube.once('addSong', (queue, song) =>
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: 'Đã thêm một bài hát',
                                iconURL: interaction.guild.iconURL()
                            })
                            .setDescription(`\`\`\`${song.name}\`\`\``)
                            .addFields(
                                { name: '🤵 Tác giả', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
                                { name: '⏳ Thời lượng', value: song.formattedDuration, inline: true },
                                { name: '🎼 Nguồn', value: source(song.source), inline: true }
                            )
                            .setThumbnail(song.thumbnail)
                            .setTimestamp()
                            .setFooter({
                                text: `Thêm bởi ${interaction.user.tag}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setColor('Random')
                    ]
                })
            )
            distube.once('addList', (queue, playlist) =>
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: 'Đã thêm một playlist',
                                iconURL: interaction.guild.iconURL()
                            })
                            .setDescription(`\`\`\`${playlist.name}\`\`\``)
                            .addFields(
                                { name: '📃 Số lượng bài hát', value: `${playlist.songs.length}`, inline: true },
                                { name: '⏳ Thời lượng', value: `${playlist.formattedDuration}`, inline: true },
                                { name: '🎼 Nguồn', value: `${source(playlist.source)}`, inline: true }
                            )
                            .setThumbnail(playlist.thumbnail)
                            .setTimestamp()
                            .setFooter({
                                text: `Thêm bởi ${interaction.user.tag}`,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setColor('Random')
                    ]
                })
            )
        }
        else interaction.followUp('🔊 Bạn phải vào một voice channel')
    }
}