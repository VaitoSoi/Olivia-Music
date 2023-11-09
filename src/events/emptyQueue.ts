import { GuildQueue, GuildQueueEvent, QueueRepeatMode } from "discord-player";
import { EventBuilder } from "../lib/event";

export default new EventBuilder()
    .setName(GuildQueueEvent.emptyQueue)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue: GuildQueue) => queue.setRepeatMode(QueueRepeatMode.OFF))