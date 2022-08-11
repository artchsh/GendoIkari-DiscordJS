const discord = require('discord.js');
const config = require("../config.json");

const moment = require("moment");
require("moment-duration-format");
const ms = require("ms");
const os = require("node:os");
const packageJson = require("../package.json");

const Enmap = require('enmap');
const cron = require('node-cron');

module.exports = async (client) => {

    client.user.setPresence({
        status: "ONLINE"
    });

    function randomstatus() {
        let status = [
            `${config.prefix}помощь | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} пользователь 👥`,
            `${config.prefix}помощь | ${client.guilds.cache.size} серверов 🌐`,
            `${config.prefix}помощь | 24/7 ОНЛАЙН...!`
        ];
        let rstatus = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[rstatus], {
            type: "PLAYING"
        });
    };
    setInterval(randomstatus, 15000);

    function botStats() {
        const duration = moment.duration(client.uptime).format("**D [D], H [H], m [M], s [S]**");
        const embed = new discord.MessageEmbed()
            .setTitle(`⚙ • System Statistics`)
            .setColor(config.color)
            .setDescription(`
\`\`\`asciidoc
• Platform - Arch     :: ${process.platform} - ${process.arch}
• Bot Uptime          :: ${duration}
• Memory Usage        :: ${formatBytes(process.memoryUsage.rss())}
• Process Uptime      :: ${ms(Math.round(process.uptime() * 1000), { long: true })}
• OS Uptime           :: ${ms(os.uptime() ?? 0, { long: true })}
• Node.js version     :: ${process.version}
• Discord.js version  :: v${discord.version}
• Bot Version         :: v${packageJson.version}
\`\`\`
            `)
        let channelInfo = client.channels.cache.get(`968682971366318080`)
        channelInfo.bulkDelete(1)
        channelInfo.send({
            embeds: [embed]
        })
    }

    function formatBytes(bytes) {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };

    /*
     * BIRTHDAY SYSTEM
     */
    const userDB = new Enmap("Profile");
    function birthdaySystem() {
        client.guilds.cache.forEach((guild) => {
            guild.members.fetch().then(members => {
                members.forEach(member => {
                    let key = `${member.id}`
                    userDB.ensure(key, {
                        user: member.id,
                        guild: guild.id,
                        exp: 0,
                        level: 1,
                        club: "-",
                        voiceHours: 0,
                        voiceMinutes: 0,
                        like: "Никто",
                        joinedTimestamp: 0,
                        BDday: undefined,
                        BDmonth: undefined,
                        BDwas: 0
                    });
                    let dayNow = new Date().getDate()
                    let monthNow = new Date().getMonth()
                    if (dayNow == "1") {
                        if (monthNow == "0") {
                            userDB.set(key, 0, "BDwas")
                        }
                    }
                    let BDwas = userDB.get(key, "BDwas")
                    if (BDwas == 1) {
                        return
                    } else {
                        let dayNow = new Date().getDate()
                        let monthNow = new Date().getMonth()
                        monthNow++
                        let userMonth = userDB.get(key, "BDmonth")
                        if (userMonth == undefined) {
                            return
                        } else {
                            let userDay = userDB.get(key, "BDday")
                            if (monthNow == userMonth) {
                                if (dayNow == userDay) {
                                    let guildID = userDB.get(key, "guild")
                                    let channelId = guild.systemChannelId
                                    client.guilds.cache.get(`${guildID}`).channels.cache.get(`${channelId}`).send(`<@${member.id}>, поздравляю с днём рождения!`).catch(console.error)
                                    userDB.set(key, 1, "BDwas")
                                    return console.log(`Happy birthday ${member.tag}!`)
                                }
                            }
                        }
                    }
                });
            });
        })
    }

    cron.schedule('0 0 * * *', () => {
        birthdaySystem();
        console.log('Проверил дни рождения')
    });



    client.logger.log(`Выполнен вход как ${client.user.username}`, "success");
    client.logger.log(`Количество серверов - ${client.guilds.cache.size}`, "info");

};
