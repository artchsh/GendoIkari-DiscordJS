const discord = require('discord.js');
const config = require('../../config.json');
module.exports = {

    name: "пинг",
    aliases: [],
    description: "Получить пинг бота",
    category: "Util",
    cooldown: 5,
    run: async (client, message, args) => {
        try{
            const m = await message.channel.send('Pinging...')
            const embed = new discord.MessageEmbed()
                .addField('Задержка', `_**${m.createdTimestamp - message.createdTimestamp}мс**_`, true)
                .addField('API', `_**${client.ws.ping}мс**_`, true)
                .setColor(config.color)

            setTimeout(function() { m.edit({ content: ' ', embeds: [embed] }) }, 2000);
        } catch (e) {
            console.log(e)
        }
    }
};