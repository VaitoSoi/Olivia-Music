import { GuildQueue, GuildQueueEvent, Track } from "discord-player";
import { EventBuilder } from "../lib/event";
import { EmbedBuilder } from "discord.js";

export default new EventBuilder()
    .setName(GuildQueueEvent.audioTracksAdd)
    .setOnce(false)
    .setType('player')
    .setExecute(async (olivia, queue: GuildQueue<Record<string, any>>, track: Track[]) =>
        queue.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `${queue.guild.name} - Playlist Add`,
                        iconURL: queue.guild.iconURL() || undefined
                    })
                    .setDescription(
                        '**Đã thêm một playlist:**\n' +
                        '```\n' +
                        track[0].playlist?.title +
                        '```'
                    )
                    .setColor('Random')
                    .setThumbnail(track[0].playlist?.thumbnail || null)
                    .addFields(
                        { name: `🤵‍♂️ Tác giả`, value: `${track[0].playlist?.author.name}`, inline: true },
                        { name: '⌛ Số bài hát', value: `${track[0].playlist?.tracks.length}`, inline: true },
                        { name: '🎶 Nguồn', value: `${track[0].playlist?.source.toUpperCase()}`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `${olivia.client.user?.tag}`,
                        iconURL: olivia.client.user?.avatarURL() || ''
                    })
            ]
        })
    )