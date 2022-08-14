const discord = require('discord.js')
const config = require('../../config.json');
const { readdirSync } = require('fs');

module.exports = {
    name: "помощь",
    aliases: ["пом", "help"],
    description: "Получите список всех команд",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {
        if (!args[0]) {

            const categories = readdirSync(`./commands/`)

            const emo = {
                Misc: "misc ・ ",
                Util: "util ・ ",
                Developer: "dev ・ ",
                Language: "lang ・ ",
                Moderation: "mod ・ "
            };
    
            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: `❯ ・ Список команд - ${client.commands.size} команд`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setColor(config.color)
    
            for (const category of categories) {
                const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ", "\n");
                let embedFields = embed.fields
                embedFields.push({
                    name: `${emo[category]} ${(category)} команды`,
                    value: `> ${commands}`,
                    inline: false
                });
            }
    
            return message.channel.send({
                embeds: [embed]
            });


        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

            if (!command) {
                const embed = new discord.EmbedBuilder()
                        .setDescription(`Неверная команда! Используйте \`${config.prefix}помощь\` для всех моих команд`)
                        .setColor(config.color)
                return message.channel.send({
                        embeds: [embed]
                });
            }

            const embed = new discord.EmbedBuilder()
                .setTitle("Детали команды:")
                .setThumbnail('https://hzmi.xyz/assets/images/question_mark.png')
                .addField("Команда:", command.name ? `\`${command.name}\`` : "Нет имени для этой команды.", true)
                .addField("Использование:", command.usage ? `\`${command.usage}\`` : `\`${config.prefix}${command.name}\``, true)
                .addField('Алиасы:', `\`${command.aliases.length ? command.aliases.join(" | ") : "Нет."}\``, true)
                .addField("Описание команды:", command.description ? command.description : "Нет описания для этой команды.", true)
                .setColor(config.color);
            return message.channel.send({
                    embeds: [embed]
            });
        }

    }
};
