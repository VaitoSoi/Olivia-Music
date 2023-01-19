const chalk = require('chalk')
const { SlashCommandBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('! ADMIN ONLY !')
        .addStringOption(option => option
            .setName('action')
            .setDescription('! ADMIN ONLY !')
            .setRequired(true)
        ),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        if (interaction.user.id != (await client.application.fetch()).owner.id) return
        try {
            eval(interaction.options.get('action')?.value)
            interaction.editReply('✅ Evaled')
        } catch (e) {
            interaction.editReply(`\`\`\`${e}\`\`\``)
            console.error(chalk.red(e))
        }
    }
}