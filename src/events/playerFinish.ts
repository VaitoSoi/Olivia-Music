import { GuildQueue, GuildQueueEvent, QueueRepeatMode } from "discord-player";
import { EventBuilder } from "../lib/event";

export default new EventBuilder()
    .setName(GuildQueueEvent.playerFinish)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue: GuildQueue) => {
        console.log('END')
        queue.setRepeatMode(QueueRepeatMode.OFF)
        queue.node.stop(true);
    })