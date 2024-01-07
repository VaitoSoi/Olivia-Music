import Discord from 'discord.js'
import fs from 'node:fs'
import AsciiTable from 'ascii-table3'
import Path from 'node:path'
import * as Player from 'discord-player'
import { ENV } from './config'
import { CommandBuilder, CommandDataBuilder } from './command'
import { EventBuilder } from './event'
import { Logger } from './logger'
import { OliviaExpress } from './expres'
import crypto from 'node:crypto'

export class Olivia {
    public client: Discord.Client
    public player: Player.Player
    public commands: {
        collection: Discord.Collection<string, CommandBuilder | CommandDataBuilder>,
        jsonArray: Discord.RESTPostAPIChatInputApplicationCommandsJSONBody[]
    } = {
            collection: new Discord.Collection(),
            jsonArray: []
        }
    public logger: Logger = new Logger('./debug.log')
    private express: OliviaExpress;

    constructor(public env: ENV) {
        this.client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildVoiceStates
            ],
            allowedMentions: {
                repliedUser: true
            }
        })
        this.player = new Player.Player(this.client, {})
        this.express = new OliviaExpress(this)

        this.logger.debug('global', 'Initialized client')
    }

    public async run(): Promise<void> {
        await this.handleEvent(Path.join(__dirname, '..', 'events'))
        await this.handleCommand(Path.join(__dirname, '..', 'commands'))
        await this.player.extractors.loadDefault()
        this.express.start(8000)

        this.client.on(Discord.Events.ClientReady, (client) => {
            this.logger.debug('discord', `Client ${client.user.tag} (${client.user.id}) is ready!`)
            this.registerCommand(client)
        })
        this.client.on(Discord.Events.ShardReady, (shard) => this.logger.debug('discord', `Shard ${shard} is online!`))

        this.client.on(Discord.Events.Warn, (warn) => this.logger.warn('discord', warn))
        this.client.on(Discord.Events.Error, (error) => this.logger.error('discord', error))
        this.client.on(Discord.Events.ShardError, (error) => this.logger.error('discord', error))
        this.player.events.on('error', (queue, error) => this.logger.error('player', `Occur error at guild ${queue.guild.name}: ${error}`))

        this.client.login(this.env.discord.token)
            .then((token) => this.logger.debug('discord', `Logined with token: ${token}`))
            .catch((error) => this.logger.error('discord', error))
    }
    public async destroy(): Promise<void> {
        await this.client.destroy()
        this.express.server?.close()
        // await this.player.destroy()
    }

    private async handleEvent(path: string): Promise<void> {
        const files = fs.readdirSync(path).filter((file) => this.pathUtil(Path.join(path, file)))
        let listend: string[][] = []

        for (let file of files) {
            const event: EventBuilder | undefined = (await import(Path.join(path, file))).default

            if (!event) continue;
            if (event.type == 'discord')
                if (event.once) this.client.once(event.name, (...args) => event.execute(this, ...args))
                else this.client.on(event.name, (...args) => event.execute(this, ...args))
            else if (event.type == 'player')
                if (event.once) this.player.events.once(event.name as keyof Player.GuildQueueEvents, (...args: any[]) => event.execute(this, ...args))
                else this.player.events.on(event.name as keyof Player.GuildQueueEvents, (...args: any[]) => event.execute(this, ...args))

            void listend.push([file, event.name, event.type?.toUpperCase()])
        }

        this.logger.debug('global', `Listened to ${listend.length} event(s)`, { mode: null })
        this.logger.debug('global',
            new AsciiTable.AsciiTable3('Olivia Events Listener')
                .setHeading('File', 'Event Name', 'Listener')
                .addRowMatrix(listend)
                .toString(),
            { mode: ['file'] }
        )
    }

    private async handleCommand(path: string): Promise<void> {
        const files = fs.readdirSync(path).filter((file) => this.pathUtil(Path.join(path, file)))
        let handled: string[][] = []

        for (let file of files) {
            const command: CommandBuilder | CommandDataBuilder | undefined = (await import(Path.join(path, file))).default
            if (!command) continue

            const name = command instanceof CommandBuilder ? command.name : command.data.name
            this.commands.collection.set(name, command)
            this.commands.jsonArray.push(command instanceof CommandBuilder ? command.toJSON() : command.data.toJSON())

            handled.push([file, name])
        }
        this.logger.debug('global', `Handled ${handled.length} command(s)`, { mode: null })
        this.logger.debug('global',
            new AsciiTable.AsciiTable3('Olivia Commands Handler')
                .setHeading('File', 'Command Name')
                .addRowMatrix(handled)
                .toString(),
            { mode: ['file'] }
        )
    }

    private async registerCommand(client: Discord.Client<true>) {
        const rest = new Discord.REST()
        rest.setToken(this.env.discord.token)

        const callback = await rest.put(
            Discord.Routes.applicationCommands(client.user.id),
            { body: this.commands.jsonArray }
        ) as any[]

        return this.logger.debug('discord', `Registered ${callback.length}/${this.commands.collection.size} slash command(s)`)
    }

    public pathUtil(path: string): boolean {
        return fs.lstatSync(path).isFile() && path.endsWith('.js') || path.endsWith('.ts')
    }
}