const discord = require("discord.js"); // JS library for Discord
const client = new discord.Client();
const config = require("./config.json");
var botVersion = "1.0";
const fs = require("fs");
client.commands = new discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// When the bot starts
client.on("ready", () => {
    console.log("Logged in\nVersion: " + botVersion);
});

var prefix = config.prefix;
//When chat messages are received
client.on("message", function (message) {
    if (message.channel.id != "850355899201880074") return;
    // console.log(event);
    var content = message.content;
    var user = message.author;

    if (content && content.startsWith(prefix) && !user.bot) {
        var args = content.slice(prefix.length).trim().split(/ +/); // store the command for cleaner code/reading
        var command = args
            .shift()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        console.log(args);
        if (command == "bienvenue") {
            message.channel.send(messageBienvenue(user.username));
        }
        if (!client.commands.has(command)) return;
        try {
            client.commands.get(command).execute(client, message, args);
        } catch (e) {
            console.error(e);
            message.reply(
                `Un problème est survenu avec la commande ${command}. Pour obtenir la liste des commandes, essayer la commande !aide`
            );
        }
    }
});

client.on("guildMemberAdd", async (newMember) => {
    // IMPORTANT NOTE: Make Sure To Use async and rename bot to client or whatever name you have for your bot events!
    const welcomeChannel = newMember.guild.channels.cache.find(
        (channel) => channel.name === "bienvenue"
    );
    welcomeChannel.send(messageBienvenue(newMember.user.username));

    // Optional Part (you can modify those extra things if you'd like!) :D
    // let msgEmbed = new Discord.MessageEmbed()
    // .setTitle (`This is a title for a test`)
    // welcomeChannel.send(msgEmbed) | (that's commented so you know to use it only if you want an embed and also don't delete the other "welcomeChannel.send" just change it in there and say "welcomeChannel.send(msgEmbed)" and define the msgEmbed variable as a let and define it above the "welcomeChannel.send" so the bot will check and see that it's defined so errors won't happen!
    if (newMember.bot) console.log("Nouveau bot."); // checks if it's a bot that joined so the channel won't be spammed with "*Discord Bot* has joined the server" and stuff like that, so check that.
    //const newbieRole = newMember.roles.cache.find(role => role.name === 'Role Name here') // that was to define the role to give newbies (you can name the variable however you want that doesn't matter!)
    //newMember.roles.add(newbieRole.id) // this will add the role to that member!
    // All the things that are under the "Optional Part" are 100 % Optional! No Requirement to use those, just use it if you want and they won't affect the welcome message at all!
});

function messageBienvenue(username) {
    return (
        "Bienvenue **" +
        username +
        "**!\n\nAfin d'avoir accès au reste du serveur, vous devez lire tous " +
        "les messages du canal <#835209920609255515>, compléter ce qui est demandé et attendre qu'un modérateur vous donne accès au reste du serveur.\n\nBon réseautage!"
    );
}

client.login(config.token);
