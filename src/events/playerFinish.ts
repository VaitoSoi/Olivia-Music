import { GuildQueue, GuildQueueEvent, QueueRepeatMode } from "discord-player";
import { EventBuilder } from "../lib/event";

export default new EventBuilder()
    .setName(GuildQueueEvent.playerFinish)
    .setOnce(false)
    .setType('player')
    .setExecute((olivia, queue: GuildQueue) => {
        if (queue.tracks.toArray().length == 0) {
            queue.setRepeatMode(QueueRepeatMode.OFF)
            queue.node.stop(true);
        }
    })