const {
    SlashCommandBuilder,
    CommandInteraction,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra ping của bot'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        /**
         * @param {Number} ping
         * @returns {String} 
         */
        function rate(ping) {
            let str = ''
            if (ping >= 0 && ping <= 250) str = '🟢'
            else if (ping > 250 && ping <= 500) str = '🟡'
            else if (ping > 500 && ping <= 1000) str = '🟠'
            else if (ping > 1000) str = '🔴'
            return str + ' ' + ping + 'ms'
        }
        /**
         * @param {Number} ping 
         * @returns {String}
         */
        function color(ping) {
            let str = ''
            if (ping >= 0 && ping <= 250) str = '#87ff36'
            else if (ping > 250 && ping <= 500) str = '#FAEA48'
            else if (ping > 500 && ping <= 1000) str = '#F79400'
            else if (ping > 1000) str = '#FA2314'
            return str
        }
        const wsping = interaction.client.ws.ping
        interaction.channel.send({
            content: 'Checking...'
        }).then(msg => {
            const ping = msg.createdTimestamp - interaction.createdTimestamp
            const average = (ping + wsping) / 2
            msg.delete()
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('```     Ping của Olivia và Websocket     ```')
                        .setDescription(
                            `Bot's Ping: ${rate(ping)}\n` +
                            `WS's Ping: ${rate(wsping)}\n` +
                            `Average: ${rate(average)}`
                        )
                        .setColor(color(average))
                        .setTimestamp()
                        .setFooter({
                            text: 'Đo vào'
                        })
                ]
            })
        })
        const voice = interaction.guild.members.me.voice
        if (wsping > 500 && voice?.channel && voice?.channel.rtcRegion != 'hongkong') {
            const channel = voice.channel
            const components = [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('accept')
                            .setDisabled(false)
                            .setEmoji('✅')
                            .setLabel('Đồng ý')
                            .setStyle(ButtonStyle.Secondary)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('reject')
                            .setDisabled(false)
                            .setEmoji('❌')
                            .setLabel('Từ chối')
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
            const msg = await interaction.channel.send({
                content: '🔴 Phát hiện độ trễ cao\n' +
                    `❓ Đồng ý đổi khu vực từ: \`${channel.rtcRegion != null ? channel.rtcRegion : 'auto'}\` thành \`hongkong\`\n`,
                components
            })
            const colector = msg.createMessageComponentCollector()
            colector.once('collect', async (inter) => {
                if (inter.customId == 'accept') {
                    const edited_voice = await channel.setRTCRegion('hongkong', 'High ping detected')
                    const edited_channel = edited_voice?.channel ?? edited_voice
                    inter.update({
                        content:
                            '✅ Đã chỉnh thành công khu vực máy chủ âm thanh.\n' +
                            `🌏 Khi vực hiện tại: ${edited_channel.rtcRegion == 'hongkong' ? ':flag_hk: Hồng Kông' : edited_channel.rtcRegion}\n`,
                        components: []
                    })
                } else if (inter.customId == 'reject') {
                    inter.update('✅ Đã hủy')
                }
            })
        }
    }
}