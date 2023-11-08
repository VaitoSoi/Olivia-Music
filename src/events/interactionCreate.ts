import { EventBuilder } from "../lib/event";
import { Events, Interaction } from "discord.js";
import { CommandInteraction } from "../lib/lib";

export default new EventBuilder()
    .setName(Events.InteractionCreate)
    .setOnce(false)
    .setType('discord')
    .setExecute(async (olivia, interaction: Interaction) => {
        if (interaction.isCommand()) {
            const command = olivia.commands.collection.get(interaction.commandName)

            if (!command) return void await interaction.reply('Không thể tìm thấy lệnh :c')
            await interaction.deferReply()
            Promise.resolve(command.execute(interaction as CommandInteraction, olivia))
                .then(() => { })
                .catch((error) => olivia.logger.error('discord', `Occur an error: ${error.stack}\nCommand name: ${interaction.commandName}\nGuild: ${interaction.guild?.name} (${interaction.guild?.id})`))
        }
    })