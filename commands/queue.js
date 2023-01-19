const {
    SlashCommandBuilder, CommandInteraction, EmbedBuilder,
    ActionRowBuilder, ButtonBuilder, ActionRow, ButtonStyle, ButtonComponent, ComponentType
} = require('discord.js')
const { DisTube } = require('distube')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Thông tin về hàng chờ của bot'),
    /**
    * @param {CommandInteraction} interaction
    * @param {DisTube} distube
    */
    run: async (interaction, distube) => {
        const client = interaction.client
        const queue = distube.getQueue(interaction.guild)
        const max_element = 7
        if (!queue) return interaction.editReply('🛑 Đài phát thanh đang trống')
        let embed = new EmbedBuilder()
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
        /**
         * @param {String} source
         * @returns {String}
         */
        const source_emoji = (source) => {
            let output = '';
            switch (source) {
                case 'youtube': output = '<:youtube:980437302633463808>'; break
                case 'spotify': output = '<:spotify:980437591285432400>'; break
                case 'soundcloud': output = '<:soundcloud:980437924103454750>'; break
                default: output = ''
            }
            return output
        }
        /**
         * @param {Number} start 
         * @param {Number} end 
         */
        const queue_embed = (start, end) => {
            let str = ''
            for (let i = start; i <= end ?? start + 4; i++)
                if (i <= queue.songs.length) str += `${i}. ${source_emoji(queue.songs[i - 1].source)} ${queue.songs[i - 1].name} - ${queue.songs[i - 1].formattedDuration}\n`
            return new EmbedBuilder()
                .setAuthor({
                    name: 'Thông tin về hàng chờ nhạc',
                    iconURL: interaction.guild.iconURL()
                })
                .setDescription(
                    `💿 **Now playing:**\n` +
                    `\`\`\`${queue.songs[0].name}\`\`\` ` +
                    `🤵 Tác giả: [${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})\n` +
                    `⏳ Thời lượng: ${queue.songs[0].formattedDuration}\n` +
                    `🎼 Nguồn: ${source(queue.songs[0].source)}\n\n` +
                    `📃 **Queue:**\n` +
                    str
                )
        }
        if (queue.songs.length == 1) {
            const song = queue.songs[0]
            embed
                .setAuthor({
                    iconURL: interaction.guild.iconURL(),
                    name: 'Bài hát đang phát tại ' + interaction.guild.name
                })
                .setDescription(`\`\`\`${song.name}\`\`\``)
                .addFields(
                    { name: '🤵 Tác giả', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
                    { name: '⏳ Thời lượng', value: song.formattedDuration, inline: true },
                    { name: '🎼 Nguồn', value: source(song.source), inline: true },
                )
                .setColor('Random')
                .setThumbnail(song.thumbnail)
        } else embed = queue_embed(2, max_element)
        /**
         * 
         * @param {Number} page 
         * @returns {ActionRow<ButtonComponent>}
         */
        const row = (page) => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('last_page')
                    .setDisabled(page == 1 ? true : false)
                    .setEmoji('◀')
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('page')
                    .setDisabled(true)
                    .setLabel(`${page}/${Math.ceil(queue.songs.length / max_element)}`)
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('next_page')
                    .setDisabled(page == Math.ceil(queue.songs.length / max_element) ? true : false)
                    .setEmoji('▶')
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setDisabled(false)
                    .setEmoji('🗑')
                    .setStyle(ButtonStyle.Danger)
            )
        let page = 1
        const msg = await interaction.editReply({
            embeds: [embed],
            components: [row(page)]
        })
        const colector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (inter) => inter.user.id == interaction.user.id,
            time: ms('1m')
        })
        colector.on('collect', (inter) => {
            if (inter.customId == 'last_page') {
                if (page <= 1) return
                page--
                inter.update({
                    embeds: [queue_embed(page * max_element - 4, page * max_element)],
                    components: [row(page)]
                }).catch(e => { })
            } else if (inter.customId == 'next_page') {
                if (page == Math.ceil(queue.songs.length)) return
                page++
                inter.update({
                    embeds: [queue_embed((page - 1 == 1 ? 1 : 0) + (page - 1) * max_element + 1, page * max_element)],
                    components: [row(page)]
                }).catch(e => { })
            } else if (inter.customId == 'delete') {
                inter.reply({
                    content: '✅ Deleted',
                    ephemeral: true
                })
                inter.message.delete()
            }
        })
        colector.once('end', () => {
            msg?.edit({
                components: [],
                content: 'Time out ❕'
            }).catch(e => { })
        })
    }
}