const { BaseInteraction, Events,
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js')
const chalk = require('chalk')
const ms = require('ms')

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    distube: false,
    /**
     * @param {BaseInteraction} interaction 
     */
    async run(interaction) {
        if (interaction.isCommand()) {
            const name = interaction.commandName
            const cmd = interaction.client.slash[name]
            if (!cmd) return interaction.reply('unknow command')
            await interaction.deferReply({
                ephemeral: interaction.client.distube.getQueue(interaction)?.playing == true
            }).catch((e) => console.error(chalk.red(`[DISCORD.JS] Error: ${e}`)))
            cmd.run(interaction, interaction.client.distube)
        } else if (interaction.isButton()) {
            const distube = interaction.client.distube
            const queue = distube.getQueue(interaction)
            /**
             * @param {Boolean} play 
             * @returns 
             */
            const rows = (play) => [
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
                            .setCustomId(play == false ? 'pause' : 'play')
                            .setEmoji(play == false ? '⏸' : '▶')
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
            switch (interaction.customId) {
                case 'stop':
                    distube.stop()
                    interaction.update({
                        content: '⏹ Đã dừng phát nhạc',
                        components: []
                    })
                    require('../index').message.splice(
                        [...require('../index').message].map(i => i.guild).indexOf(interaction), 1
                    )
                    break;
                case 'previous':
                    distube.previous(interaction)
                    interaction.reply({
                        content: '⏮ Đã chuyển về bài trước',
                        ephemeral: true
                    })
                    break;
                case 'pause':
                    distube.pause(interaction)
                    interaction.update({
                        components: rows(true)
                    })
                    break
                case 'play':
                    distube.resume(interaction)
                    interaction.update({
                        components: rows(false)
                    })
                    break
                case 'next':
                    distube.skip(interaction)
                    interaction.reply({
                        content: '⏭ Đã chuyến đến bài tiếp theo',
                        ephemeral: true
                    })
                    break
                case 'shuffle':
                    distube.shuffle(interaction)
                    interaction.reply({
                        content: '🔀 Đã xáo trôn hàng chờ',
                        ephemeral: true
                    })
                    break
                case 'queue':
                    const max_element = 7
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
                    const msg = await interaction.reply({
                        embeds: [embed],
                        components: [row(page)],
                        ephemeral: true
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
                            inter.update({
                                content: '✅ Deleted',
                                components: []
                            })
                        }
                    })
                    colector.once('end', () => {
                        msg?.edit({
                            components: [],
                            content: 'Time out ❕'
                        }).catch(e => { })
                    })
                    break;
                case 'setting':
                    interaction.reply({
                        content: '⚠ Nút này chưa sẳn sàng để dùng ⚠',
                        ephemeral: true
                    })
                    break
                case 'delete':
                    interaction.reply({
                        content: '✅ Deleted',
                        ephemeral: true
                    })
                    interaction.message.delete()
                    break
            }
        }
    }
}