const fs = require("fs");

module.exports = (client) => {

    const eventFiles = fs.readdirSync(`./events/`).filter((file) => file.endsWith(".js"));

    for (let file of eventFiles) {
        try {
            const Event = require(`../events/${file}`);
            Event.event = Event.event || file.replace(".js", "")
            client.on(file.split(".")[0], (...args) => Event(client, ...args));
            client.logger.log(`${file} был добавлен.`, "event");
        } catch (err) {
            client.logger.log("Ошибка во время загрузки", "warn")
            client.logger.log(err, "error");
        }
    }
    client.logger.log(`Успешно загружено [EVENTS]`, "success");
};