import { CommandBuilder } from "../lib/command";

export default new CommandBuilder()
    .setName("leave")
    .setDescription("Thoát khỏi VC hiện tại")
    .setExecute(async (interaction, olivia) => {
        if (!interaction.guild) return;
        
        const queue = olivia.player.nodes.get(interaction.guild)
        if (queue) queue.node.stop();
        (await interaction.guild.members.fetchMe()).voice.disconnect();

        interaction.editReply('Đã ngắt kết nối.')
    })