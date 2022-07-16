const discord = require('discord.js')
const {
    color
} = require('../../config.json');
const Enmap = require("enmap");

module.exports = {

    name: "клуб",
    aliases: ["кл", "club"],
    description: "Просмотр информации о вашем клубе, настройка, управление",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {
        const userDB = new Enmap("Profile");
        const key = `${message.author.id}`;

        const memberClub = userDB.get(key, "club")
        if (memberClub === "-" && args[0] != "создать") {
            return message.channel.send("Вы не состоите ни в каком клубе! Чтобы создать клуб напишите `.club создать`")
        }


        const keyClub = `${message.guild.id}-${memberClub}`
        const clubDB = new Enmap("Club");



        if (!args[0]) {
            message.channel.send("Введите: `.club создать`, `.club инфо`, `.club пригласить`, `.club выйти`")
        } else {
            if (args[0] === "создать") {
                if (memberClub === "-") {
                    if (!args[1]) {
                        message.channel.send("Укажите название клуба `.club создать <имя клуба>`")
                    } else {
                        let clubName = args.join(" ").replace(args[0], "").replace(" ", "")
                        const keyClubNew = `${message.guild.id}-${clubName}`
                        clubDB.ensure(keyClubNew, {
                            creator: undefined,
                            memberCount: 0,
                            members: []
                        })
                        const checkClubExist = clubDB.get(keyClubNew, "creator")
                        if (checkClubExist != undefined) {
                            message.channel.send(`Клуб с таким именем уже существует. Выберите другое имя`)
                        } else {
                            clubDB.set(keyClubNew, message.author.id, "creator")
                            clubDB.inc(keyClubNew, "memberCount")
                            userDB.set(key, clubName, "club")
                            clubDB.push(keyClubNew, message.author.tag, "members")
                            message.channel.send(`Вы успешно создали клуб под именем **${clubName}**`)
                        }
                    }
                } else {
                    console.log("club?")
                    message.channel.send("Вы уже состоите в клубе! Чтобы удалить клуб напишите `.club удалить`")
                }
            } else if (args[0] === "инфо") {
                if (memberClub === "-") {
                    console.log("no club")
                    message.channel.send("Вы не состоите ни в каком клубе! Чтобы создать клуб напишите `.club создать`")
                } else {
                    console.log("club?")
                    // there code for club info
                    const clubCreator = clubDB.get(keyClub, "creator")
                    const clubMemberCount = clubDB.get(keyClub, "memberCount")
                    const clubMemberList = clubDB.get(keyClub, "members")
                    const embedInfo = new discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`Информация о клубе ${memberClub}`)
                        .addFields({
                            name: 'Создатель (ID)',
                            value: "```" + `${clubCreator}` + "```",
                            inline: true
                        }, {
                            name: 'Кол-во участников',
                            value: "```" + `${clubMemberCount} / 10` + "```",
                            inline: true
                        }, {
                            name: 'Список участников',
                            value: "```" + `${clubMemberList}` + "```",
                            inline: false
                        }, )
                    message.channel.send({
                        embeds: [embedInfo]
                    });
                }
            } else if (args[0] === "пригласить") {
                if (memberClub === "-") {
                    message.channel.send("Вы не состоите ни в каком клубе! Чтобы создать клуб напишите `.club создать`")
                } else {
                    console.log("club?")
                    if (!args[1]) {
                        return message.channel.send("Вам нужно указать пользователя. `.клуб пригласить <@пользователь>`")
                    }
                    // there code for club invite
                    /*
                     * Club invite to person's dm than button click => assigned to new club, if in club already -1 from old club
                     */
                    const mention = message.mentions.members.first()
                    const serverDB = new Enmap("serverSettings")
                    let serverKey = `${message.guild.id}`
                    serverDB.ensure(serverKey, {
                        varClubName: "",
                    })
                    const userDB = new Enmap("Profile")
                    let clubName = userDB.get(key, "club")
                    serverDB.set(serverKey, clubName, "varClubName")
                    const row = new discord.MessageActionRow()
                        .addComponents(
                            new discord.MessageButton()
                            .setCustomId('acceptInviteButton')
                            .setLabel('Принять')
                            .setStyle('SUCCESS'),
                            new discord.MessageButton()
                            .setCustomId('declineInviteButton')
                            .setLabel('Отклонить')
                            .setStyle('DANGER'),
                        );

                    const embed = new discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`Вы были приглашены в клуб ${clubName}`)

                    mention.send({
                        ephemeral: false,
                        embeds: [embed],
                        components: [row]
                    });
                }
            } else if (args[0] === "выйти") {
                if (memberClub === "-") {
                    message.channel.send("Вы не состоите ни в каком клубе! Чтобы создать клуб напишите `.club создать`")
                } else {
                    console.log("club?")
                    // there code for club leave
                    clubDB.dec(keyClub, "memberCount")
                    userDB.set(key, "-", "club")
                    clubDB.remove(keyClub, message.author.tag, "members")
                    message.channel.send("Вы успешно вышли из клуба")
                }
            } else if (args[0] === "удалить") {
                if (memberClub === "-") {
                    message.channel.send("Вы не состоите ни в каком клубе! Чтобы создать клуб напишите `.club создать`")
                } else {
                    console.log("club?")
                    const clubCreatorTId = clubDB.get(keyClub, "creator")
                    if (clubCreatorTId === message.author.id) {
                        const clubName = userDB.get(key, "club")
                        const memberList = clubDB.get(keyClub, "members")
                        memberList.forEach(element => {
                            let clubMemberId = client.users.cache.find(u => u.tag === element).id
                            userDB.set(`${clubMemberId}`, "-", "club")
                        });
                        clubDB.delete(keyClub)
                        userDB.set(key, "-", "club")
                        message.channel.send(`Вы успешно удалили свой клуб ${clubName}`)
                    } else {
                        return message.channel.send("Вы не создатель этого клуба")
                    }
                }
            } else {
                message.channel.send("Неверный аргумент. Введите: `.club создать`, `.club инфо`, `.club пригласить`, `.club выйти`")
            }

        }
    }
};
