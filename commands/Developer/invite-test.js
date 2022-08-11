const Enmap = require('enmap');
const discord = require('discord.js')
const {
    color
} = require('../../config.json');

module.exports = {
    name: "invite-test",
    aliases: ["i-t", "invtest"],
    description: "",
    category: "Developer",
    cooldown: 0,
    run: async (client, message, args) => {
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
            .setColor('#0099ff')
            .setTitle(`Вы были приглашены в клуб clubName`)

        message.channel.send({
            ephemeral: false,
            embeds: [embed],
            components: [row]
        });
    }
};