import { SlashCommandBuilder } from "discord.js";
import { CommandDataBuilder } from "../lib/command";

export default new CommandDataBuilder()
    .setData(
        new SlashCommandBuilder()
            .setName('dev')
            .setDescription("! Developer only !")
            .addSubcommand(sub => sub
                .setName('restart')
                .setDescription('Restart client')
            )
    )
    .setExecute(async (interaction, main) => {
        const subcommand = interaction.options.getSubcommand()

        if (subcommand == 'restart') {
            await main.destroy();
            await main.run();
        }
    })