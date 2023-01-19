const { SlashCommandBuilder, CommandInteraction } = require('discord.js')
const { RepeatMode } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Chỉnh chế độ lặp lại')
        .addNumberOption(option => option
            .setName('mode')
            .setDescription('Chế độ lặp')
            .addChoices(
                { name: 'Tắt', value: RepeatMode.DISABLED },
                { name: 'Lặp toàn bộ hàng chờ', value: RepeatMode.QUEUE },
                { name: 'Lặp bài hát hiện tại', value: RepeatMode.SONG }
            )
            .setRequired(true)
        ),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        client.distube.setRepeatMode(interaction.guild, interaction.options.get('mode')?.value)
            .then(mode => {
                let string = ''
                switch (mode) {
                    case RepeatMode.DISABLED: string = 'Tắt'; break
                    case RepeatMode.QUEUE: string = 'Lặp toàn bộ hàng chờ'; break
                    case RepeatMode.SONG: string = 'Lặp bài hát hiện tại'; break
                }
                interaction.followUp({
                    content: `🔁 Đã chỉnh chế độ lặp thành \`${string}\``
                })
            })
            .catch(() => interaction.editReply('😓 Không thể chỉnh chế độ lặp'))
    }
}