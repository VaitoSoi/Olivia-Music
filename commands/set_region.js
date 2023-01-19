const { SlashCommandBuilder, CommandInteraction, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_region')
        .setDescription('Chỉnh khu vực của máy chủ âm thanh của kênh âm thanh chỉ định hoặc hiện tại')
        .addStringOption(option => option
            .setName('region')
            .setDescription('Vùng muốn chuyển đến')
            .setRequired(true)
            .addChoices(
                { name: 'Tự động', value: 'null' },
                { name: 'Brazil', value: 'brazil' },
                { name: 'Hồng Kông (khuyến nghị)', value: 'hongkong' },
                { name: 'Ấn Độ', value: 'india' },
                { name: 'Nhật Bản', value: 'Japan' },
                { name: 'Rotterdam', value: 'rotterdam' },
                { name: 'Nga', value: 'russia' },
                { name: 'Singapore (khuyến nghị)', value: 'singapore' },
                { name: 'Nam Phi', value: 'southafrica' },
                { name: 'Sydney', value: 'sydney' },
                { name: 'Trung Mỹ', value: 'us-central' },
                { name: 'Đông Mỹ', value: 'us-east' },
                { name: 'Nam Mỹ', value: 'us-south' },
                { name: 'Tây Mỹ', value: 'us-west' }
            )
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Kênh muốn chỉnh')
            .addChannelTypes(ChannelType.GuildVoice)
        ),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        /**
         * @param {String} region 
         * @returns {String}
         */
        const region_emoji = (region) => {
            let str = ''
            switch (region) {
                case 'null':
                case null: str = '🌏 Tự động'; break;
                case 'brazil': str = ':flag_br: Brazil'; break;
                case 'hongkong': str = ':flag_hk: Hồng Kông'; break;
                case 'india': str = ':flag_in: Ấn Độ'; break;
                case 'japan': str = ':flag_jp: Nhật Bản'; break;
                case 'rotterdam': str = ':flag_nl: Hà Lan'; break;
                case 'russia': str = ':flag_ru: Nga'; break;
                case 'singapore': str = ':flag_sg: Singapore'; break;
                case 'southafrica': str = ':flag_za: Nam Phi'; break;
                case 'sydney': str = ':flag_au: Sydney'; break;
                case 'us-central': str = '🌎 Trung Mỹ'; break;
                case 'us-east': str = '🌎 Đông Mỹ'; break;
                case 'us-south': str = '🌎 Nam Mỹ'; break;
                case 'us-west': str = '🌎 Tây Mỹ'; break;
                default: str = '`¯\\_(ツ)_/¯`'
            }
            return str
        }
        const id = interaction.options.get('channel')?.value ?? interaction.member.voice?.channel?.id
        if (!id) return interaction.editReply('🛑 Thiếu channel')
        const channel = interaction.guild.channels.cache.get(id)
        const region = interaction.options.get('region')?.value
        if (channel.rtcRegion == region) return interaction.editReply(`Máy chủ âm thanh của kênh <#${channel.id}> đã ở ${region_emoji(channel.rtcRegion)}`)
        if (!channel.isVoiceBased()) return
        channel.setRTCRegion(region == 'null' ? null : region)
            .then(edited => interaction.editReply(`Đã chỉnh khu vực máy chủ âm thanh của <#${edited.id}> thành ${region_emoji(edited.rtcRegion)}`))
            .catch(interaction.editReply('🛑 Không thể chỉnh máy chủ âm thanh'))
    }
}