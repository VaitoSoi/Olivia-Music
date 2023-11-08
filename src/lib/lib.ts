import Discord from 'discord.js'

export type Awaittable<T> = T | PromiseLike<T>
export type Executable<P extends any[] = any[], R extends any = any> = (...param: P) => R
export type CommandInteraction = Discord.ChatInputCommandInteraction