import { CommandBuilder } from "../lib/command";

export default new CommandBuilder()
    .setName("stop")
    .setDescription("Dừng phát nhạc")
    .setExecute(async (interaction, olivia) => {
        const userVC = (await interaction.guild?.members.fetch(interaction.user))?.voice.channel
        if (!userVC) return interaction.editReply({
            content: 'Bạn không trong Voice Channel :c'
        })
        const botVC = (await interaction.guild?.members.fetchMe())?.voice.channel
        if (!!botVC && botVC.id != userVC.id) return interaction.editReply({
            content: 'Bạn không trong cùng Voice Channel với bot D:'
        })
        if (!interaction.guild) return

        olivia.player.nodes.get(interaction.guild)?.node.stop()
        interaction.editReply(`Đã dừng phát nhạc`)
    })