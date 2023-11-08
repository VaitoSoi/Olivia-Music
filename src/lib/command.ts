import Discord from 'discord.js'
import { Executable, CommandInteraction } from './lib'
import { Olivia } from '.'

type CommandExecute = Executable<[interaction: CommandInteraction, mainClass: Olivia], void>
type CommandAutocomplete = Executable<[interaction: Discord.AutocompleteInteraction, mainClass: Olivia], void>
type CommandData = Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder | Discord.SlashCommandOptionsOnlyBuilder

export class CommandBuilder extends Discord.SlashCommandBuilder {
    public execute: CommandExecute = () => { }
    public autocomplete: CommandAutocomplete = () => { }

    constructor() {
        super()
        this.setDMPermission(false)
    }

    public setExecute(execute: CommandExecute): CommandBuilder {
        this.execute = execute;
        return this
    }
    public setAutocomplete(autocomplete: CommandAutocomplete): CommandBuilder {
        this.autocomplete = autocomplete;
        return this
    }
}

export class CommandDataBuilder {
    public name: string = ''
    public data: CommandData = new Discord.SlashCommandBuilder()
    public execute: CommandExecute = () => { }
    public autocomplete: CommandAutocomplete = () => { }

    constructor() { }

    public setName(name: string): CommandDataBuilder {
        this.name = name;
        return this
    }
    public setData(data: CommandData): CommandDataBuilder {
        this.data = data;
        return this
    }
    public setExecute(execute: CommandExecute): CommandDataBuilder {
        this.execute = execute;
        return this
    }
    public setAutocomplete(autocomplete: CommandAutocomplete): CommandDataBuilder {
        this.autocomplete = autocomplete;
        return this
    }
}