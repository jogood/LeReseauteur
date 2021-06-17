module.exports = {
    name: "aide",
    description: "Affiche la liste des commandes",
    execute(client, message, args) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed();

        client.commands.forEach((command) => {
            embed.addField(`${command.name}`, `${command.description}`, false);
        });
        message.channel.send(embed);
    },
};
