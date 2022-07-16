const discord = require("discord.js");
const config = require("../config.json");
const Enmap = require("enmap");

module.exports = async (client, message) => {

    client.settings.ensure(message.guildId, {
        prefix: config.prefix,
    });

    let prefix = client.settings.get(message.guildId, "prefix");

    // Profile system: points, level, cash, club and etc
    client.profile = new Enmap("Profile");
    if (message.guild) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) {
            const key = `${message.author.id}`;
            client.profile.ensure(key, {
                user: message.author.id,
                guild: message.guild.id,
                exp: 0,
                level: 1,
                club: "-",
                voiceHours: 0,
                voiceMinutes: 0,
                like: "Никто",
                joinedTimestamp: 0,
                BDday: undefined,
                BDmonth: undefined
            });

            // Declaring max and min vars
            const maxPoints = 210
            const minPoints = 100

            // Calculating points for the user and writing it
            points = Math.floor(Math.random() * (maxPoints - minPoints) + minPoints); //  points calc -> random number (minPoints <= x < maxPoints)
            client.profile.math(key, "+", points, "exp") // set value for profile exp

            // Max exp for new level
            maxExp = 999 // max exp for get new level | > 1000 does not include 1000

            // Getting current user's exp and lvl
            currentExp = client.profile.get(key, "exp")
            currentLvl = client.profile.get(key, "level")

            // Dev only
            console.log(`${message.author.tag} - ${currentExp} / 1000 exp - ${currentLvl} lvl`)

            // Check for new user's level
            if (currentExp > maxExp) {
                client.profile.inc(key, "level")
                client.profile.set(key, 0, "exp")
                currentLvlUp = client.profile.get(key, "level")
                message.reply(`Теперь у тебя **${currentLvlUp}** уровень!`)
            }
        }
    }


    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmda = args.shift().toLowerCase();
    let command = client.commands.get(cmda) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmda));
    if (!command) return;

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new discord.Collection());
    }

    let now = Date.now();
    let timeStamp = client.cooldowns.get(command.name) || new Collection();
    let cool = command.cooldown || 5;
    let userCool = timeStamp.get(message.author.id) || 0;
    let estimated = userCool + cool * 1000 - now;

    if (userCool && estimated > 0) {
        let cool = new discord.MessageEmbed()
            .setDescription(`❌ Please wait ${( estimated / 1000 ).toFixed()}s more before reusing the ${command.name} command.`)
        return (await message.reply({
                embeds: [cool]
            })
            .then(msg => {
                setTimeout(() => msg.delete().catch(() => null), estimated)
            })
        )
    }

    timeStamp.set(message.author.id, now);
    client.cooldowns.set(command.name, timeStamp);




    try {
        command.run(client, message, args)
    } catch (error) {
        client.logger.log(error, "error");
        message.reply({
            content: `Произошла ошибка во время выполнения этой команды!`
        });
    } finally {
        client.logger.log(`Юзер : ${message.author.tag} | команда : ${command.name}`, "info");
    }
};