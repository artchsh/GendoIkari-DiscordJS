const discord = require('discord.js')
const {
    color
} = require('../../config.json');
const Enmap = require("enmap");

module.exports = {

    name: "нравится",
    aliases: ["н", "like"],
    description: "Указать кто вам нравится в вашем профиле",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {
        const userDB = new Enmap("Profile");
        const key = `${message.author.id}`;
        if (!args[0]) {
            message.channel.send("Вам нужно упомянуть пользователя")
            return
        }

        //let isMention = args[0].match(MessageMentions.USERS_PATTERN)
        //if (!isMention) { return message.reply(`Это не пользователь.`)}

        const mention = message.mentions.members.first().id;
        let userTag = '';
        client.users.fetch(`${mention}`).then((user) => {
            userTag = user.tag;
        }).catch(console.error);
        userDB.set(key, `${userTag}`, "like")
        message.channel.send("Вы успешно указали человека, который вам нравится!")
    }
};
