module.exports = {
    name: "clear",
    aliases: ["clr","ls"],
    description: "Команда, чтобы удалить определенное количество сообщений в данном канале",
    category: "Moderation",
    cooldown: 5,
    run: async (client, message, args) => {
      // commands starts here
      const amountToDelete = args[0]
      message.channel.bulkDelete(amountToDelete).then(() => {
        message.channel.send(`Удалено ${amountToDelete} сообщений.`).then(msg => msg.delete(3000));
      });
    }
};