const Enmap = require('enmap');
const discord = require('discord.js')
const {
    color
} = require('../../config.json');
// discord js 13.5 was
module.exports = {
    name: "checkDB",
    aliases: ["cdb", "чек"],
    description: "",
    category: "Developer",
    cooldown: 5,
    run: async (client, message, args) => {
        const clubDB = new Enmap("Club");
        const userDB = new Enmap("Profile");
        console.log(clubDB);
        console.log(userDB);
    }
};