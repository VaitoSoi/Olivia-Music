import { Olivia } from "."
import { Executable } from "./lib"

type EventType =
    | 'player'
    | 'discord'
    | 'mainClass'
type EventExecute = Executable<[mainClass: Olivia, ...eventParam: any], void>

export class EventBuilder {
    public name: string = ''
    public once: boolean = false
    public type: EventType = 'discord'
    public execute: EventExecute = () => { }

    constructor() { }

    public setName(name: string): EventBuilder { this.name = name; return this }
    public setOnce(once: boolean): EventBuilder { this.once = once; return this }
    public setType(type: EventType): EventBuilder { this.type = type; return this }
    public setExecute(execute: EventExecute): EventBuilder { this.execute = execute; return this }
}