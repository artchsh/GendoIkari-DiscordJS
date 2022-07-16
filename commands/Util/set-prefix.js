const discord = require('discord.js');
const config = require('../../config.json');

module.exports = {

    name: "префикс",
    aliases: [],
    description: "Установите свой префикс для сервера",
    category: "Util",
    cooldown: 5,
    run: async (client, message, args) => {
        const embedmissingperms = new discord.MessageEmbed()
            .setDescription(`⚠ | ${message.author.username}, у вас нет права **MANAGE_GUILD**!`)
            .setColor("RED");

        const embedmissing = new discord.MessageEmbed()
            .setDescription(`⚠ | Напишите префикс который вы хотите установить!`)
            .setColor("RED");

        const embedtoolong = new discord.MessageEmbed()
            .setDescription(`❌ | Префикс должен быть короче чем 5 знаков`)
            .setColor("RED");

        const embedsame = new discord.MessageEmbed()
            .setDescription(`⚠ | Вы указали такой же префикс который стоит сейчас`)
            .setColor("RED");

        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({ embeds: [embedmissingperms] });

        await client.settings.ensure(message.guild.id, { prefix: config.prefix });
        if (!args[0]) return message.channel.send({ embeds: [embedmissing] });
        if (args[0].length > 5) return message.channel.send({ embeds: [embedtoolong] });
        if (args[0] == client.settings.get(message.guild.id, "prefix"))
            return message.channel.send({ embeds: [embedsame] });

        if (args[0] === "reset") {
            client.settings.delete(message.guildId, "prefix")
            const embed = new discord.MessageEmbed()
                .setDescription(`Префикс поставлен по-умолчанию : \`${config.prefix}\``)
                .setColor(config.color)
            return message.channel.send({ embeds: [embed] });
        }

        client.settings.set(message.guildId, args[0], "prefix");
        const embed = new discord.MessageEmbed()
            .setDescription(`Префикс изменен на : \`${args[0]}\``)
            .setColor(config.color)
        message.channel.send({ embeds: [embed] });

    }
}