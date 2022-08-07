const translate = require('node-google-translate-skidz');
const {
    color
} = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "en",
    aliases: ["EN", "En"],
    description: "Translate from English",
    category: "Language",
    cooldown: 5,
    run: async (client, message, args) => {
        let translateResult = '';
        let userText = args.join(" ");
        try {
            const { translation } = await translate(userText, 'ru');
            translateResult = translation;
        } catch { }
        setTimeout(() => message.delete(), 1000)
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(`${message.author.username}`)
            .setDescription(`${translateResult}`)
        message.channel.send({ embeds: [embed] });
    }
};