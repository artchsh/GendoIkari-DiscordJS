const discord = require('discord.js')
const {
    color,
    timeoutBeforeDelete
} = require('../../config.json');
const Enmap = require("enmap");

module.exports = {

    name: "деньрождения",
    aliases: ["др", "деньр"],
    description: "Узнать день рождения человека, если оно указано",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {
        userDB = new Enmap("Profile");
        
        const mention = message.mentions.members.first()
        switch (args[0]) {
            case 'поставить':
                if (!mention) {
                    message.channel.send("Вам нужно упомянуть пользователю дату рождения которого вы хотите поставить")
                } else {
                    // example usage: .др поставить <@example> <day> <month>
                    const key = `${mention.id}`;
                    const day = args[2]
                    const month = args[3]
                    userDB.set(key, `${day}`, "BDday")
                    userDB.set(key, `${month}`, "BDmonth")
                    message.channel.send("Вы успешно установили свой день рождения!")
                }
                break;
            case 'удалить':
                break;
            default:
                message.channel.send("Вам нужно написать `.др поставить` либо `.др удалить`")
        }
    }
};
