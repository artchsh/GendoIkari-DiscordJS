const discord = require('discord.js')
const {
    color
} = require('../../config.json');
const Enmap = require("enmap");
userDB = new Enmap("profile");

module.exports = {

    name: "профиль",
    aliases: ["проф", "profile"],
    description: "Информация о вашем профиле",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {
        const userDB = new Enmap("Profile");
        const key = `${message.author.id}`;

        let memberLevel = userDB.get(key, "level")
        let memberExp = userDB.get(key, "exp")
        let memberVoiceHours = userDB.get(key, "voiceHours")
        let memberVoiceMinutes = userDB.get(key, "voiceMinutes")
        let memberLike = userDB.get(key, "like")
        let memberClub = userDB.get(key, "club")
        let memberAvatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`

        const profileEmbed = new discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Профиль пользователя ${message.author.username}`)
            .setThumbnail(memberAvatar)
            .addFields({
                name: 'XP',
                value: "```" + `${memberExp} / 1000` + "```",
                inline: true
            }, {
                name: 'Уровень',
                value: "```" + `${memberLevel}` + "```",
                inline: true
            }, {
                name: 'Нравится',
                value: "```" + `${memberLike}` + "```",
                inline: true
            }, {
                name: 'Клуб',
                value: "```" + `${memberClub}` + "```",
                inline: true
            }, {
                name: 'Время в голосовом чате',
                value: "```" + `${memberVoiceHours} ч. ${memberVoiceMinutes} мин.` + "```",
                inline: true
            })

        message.channel.send({
            embeds: [profileEmbed]
        });


    }
};
