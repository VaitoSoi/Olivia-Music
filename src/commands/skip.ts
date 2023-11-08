import { CommandBuilder } from "../lib/command";

export default new CommandBuilder()
    .setName("skip")
    .setDescription("Bỏ qua bài hát hiện tại")
    .setExecute(async (interaction, olivia) => {
        const userVC = (await interaction.guild?.members.fetch(interaction.user))?.voice.channel
        if (!userVC) return interaction.editReply({
            content: 'Bạn không trong Voice Channel :c'
        })
        let botVC = (await interaction.guild?.members.fetchMe())?.voice.channel
        if (!!botVC && botVC.id != userVC.id) return interaction.editReply({
            content: 'Bạn không trong cùng Voice Channel với bot D:'
        })
        if (!interaction.guild) return

        olivia.player.nodes.get(interaction.guild)?.node.skip()
        interaction.editReply(`Đã bỏ qua bài hát`)
    })