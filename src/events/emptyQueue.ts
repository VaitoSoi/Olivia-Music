import { GuildQueue, GuildQueueEvent, QueueRepeatMode } from "discord-player";
import { EventBuilder } from "../lib/event";

export default new EventBuilder()
    .setName(GuildQueueEvent.emptyQueue)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue: GuildQueue) => void queue.setRepeatMode(QueueRepeatMode.OFF) && queue.node.stop())