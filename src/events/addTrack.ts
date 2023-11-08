import { GuildQueue, GuildQueueEvent, Track } from "discord-player";
import { EventBuilder } from "../lib/event";
import { EmbedBuilder } from "discord.js";

export default new EventBuilder()
    .setName(GuildQueueEvent.audioTrackAdd)
    .setOnce(false)
    .setType('player')
    .setExecute(async (olivia, queue: GuildQueue<Record<string, any>>, track: Track) =>
        queue.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${queue.guild.name} - Track Add`,
                        iconURL: queue.guild.iconURL() || ''
                    })
                    .setDescription(
                        '**Đã thêm một bài hát:**\n' +
                        '```\n' +
                        track.title +
                        '```'
                    )
                    .setColor('Random')
                    .setThumbnail(track.thumbnail)
                    .addFields(
                        { name: `🤵‍♂️ Tác giả`, value: `${track.author}`, inline: true },
                        { name: '⌛ Thời lượng', value: `${track.duration}`, inline: true },
                        { name: '🎶 Nguồn', value: `${track.source.toUpperCase()}`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `${olivia.client.user?.tag}`,
                        iconURL: olivia.client.user?.avatarURL() || ''
                    })
            ]
        })
    )