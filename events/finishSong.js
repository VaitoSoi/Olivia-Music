const { Events, Song, Queue } = require('distube')

module.exports = {
    name: Events.FINISH_SONG,
    distube: true,
    once: false,
    /**
     * @param {Queue} queue 
     * @param {Song} song 
     */
    run: async (queue, song) =>{
        const array = [...require('../index').message]
        const index = array.map(i => i.guild).indexOf(queue.textChannel.guild.id)
        const data = require('../index').message[index]
        await queue.textChannel.messages.cache.get(data?.message)?.delete().catch(e => { })
        require('../index').message.splice(index, 1)
    }
}