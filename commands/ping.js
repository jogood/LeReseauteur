module.exports = {
    name: "ping",
    description: "Commande ping pong",
    execute(client, message, args) {
        message.reply("pong");
    },
};
