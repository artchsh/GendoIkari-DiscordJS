const discord = require("discord.js");
const {
    token
} = require("./config.json");
const Enmap = require("enmap");


const client = new discord.Client({
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    intents: 112335, //32767
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    cacheWithLimits: {
        MessageManager: {
            sweepInterval: 300,
            sweepFilter: discord.Sweepers.filterByLifetime({
                lifetime: 60,
                getComparisonTimestamp: m => m.editedTimestamp ?? m.createdTimestamp,
            })
        }
    }
});

client.settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep"
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldowns = new discord.Collection();
client.voiceGenerator = new discord.Collection();
client.logger = require('./Utils/logger');

["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('error', error => client.logger.log(error, "error"));
client.on('warn', info => client.logger.log(info, "warn"));
process.on('unhandledRejection', error => client.logger.log("UNHANDLED_REJECTION\n" + error, "error"));
process.on('uncaughtException', error => {
    client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
    client.logger.log("Uncaught Exception is detected, restarting...", "info");
    process.exit(1);
});

// we're messing up with standart commands so we are init a new slash commands to check 
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) {
        /*
        * OTHER INTERACTIONS HERE
        */
    } else {
        /*
        * BUTTON INTERACTIONS HERE
        */
        let interactionId = interaction.customId
        switch(interactionId) {
            case 'acceptInviteButton':
                console.log("accept invite button received!")
                break
            case 'declineInviteButton':
                console.log("decline invite button received!")
                break
        }

    }
    
});


client.login(token).catch(() => {
    client.logger.log('Invaid TOKEN!', "warn")
});