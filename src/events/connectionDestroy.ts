import { GuildQueue, GuildQueueEvent } from "discord-player";
import { EventBuilder } from "../lib/event";

export default new EventBuilder()
    .setName(GuildQueueEvent.connectionDestroyed)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue: GuildQueue) => queue.channel?.send(`🔇 Mất kết nối với <#${queue.channel.id}>`))