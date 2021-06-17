var listRoles = [
    {
        nom: "A1 Ouvert à changer de région",
        regex: [/changer/,/ouvert/]
    },
    {
        nom: "A2 Mobile - Nomade",
        regex: [/mobile?/,/nomade?/]
    },
    {
        nom: "01 Bas-Saint-Laurent",
        regex: [/(bas(-|\s))?(st|saint)(-|\s)laur(e|a)nt/, /^bsl$/],
    },
    {
        nom: "02 Saguenay-Lac-Saint-Jean",
        regex: [/saguenay/, /lac(-|\s)(st|saint)(-|s)jean/],
    },
    {
        nom: "03 Capitale-Nationale",
        regex: [/capitale?(-|\s)nationale?/],
    },
    {
        nom: "04 Mauricie–Centre-du-Québec",
        regex: [/^mauricie?$/, /mauricie?(-|\s)centre(-|\s)du(-|\s)quebec/],
    },
    {
        nom: "05 Estrie",
        regex: [/^estrie?$/],
    },
    {
        nom: "06 Montréal",
        regex: [/^montreal$/, /^mtl$/],
    },
    {
        nom: "07 Outaouais",
        regex: [/^outaouais$/],
    },
    {
        nom: "08 Abitibi-Temiscamingue",
        regex: [/abitibi/, /abitibi(-|\s)temiscamingue/],
    },
    {
        nom: "09 Côte-Nord",
        regex: [/cote(-|\s)nord/],
    },
    {
        nom: "10 Nord-Du-Québec",
        regex: [/nord(-|\s)du(-|\s)quebec/],
    },
    {
        nom: "11 Gaspésie Iles-De-La-Madelaine",
        regex: [/gaspesie?/, /iles?(-|\s)de(-|\s)la(-|\s)madelaine?/],
    },
    {
        nom: "12 Chaudière-Appalaches",
        regex: [/chaudiere?(-|\s)app?all?aches?/],
    },
    {
        nom: "13 Laval",
        regex: [/^laval$/],
    },
    {
        nom: "14 Lanaudière",
        regex: [/^lanaudiere$/],
    },
    {
        nom: "15 Laurentides",
        regex: [/^laurentides?$/],
    },
    {
        nom: "16 Montérégie",
        regex: [/^monteregie?$/],
    },
    {
        nom: "X1 Externe",
        regex: [/^externe?$/],
    },
];

module.exports = {
    name: "role",
    description:
        "Pour faire la soumission afin d'obtenir un rôle. Pour connaître la liste des rôles, taper !role liste",
    execute(client, message, args) {
        if (args.length == 0 || args[0] == "liste") {
            var msgRoles = "";
            listRoles.forEach((role) => {
                msgRoles += `**${role.nom}**\n`;
            });

            message.reply(
                "\nVoici la liste des rôles. " +
                    "Afin de recevoir l'assignation d'un rôle, vous devez entrer le numéro de la région ou son nom. " +
                    'Par exemple:```!role bas-st-laurent```ou```!role 01```vous donnera le rôle "01 Bas-Saint-Laurent."\n\n' +
                    msgRoles
            );
            return;
        }
        var roleAttrib = IdentifierRole(args);

        if (roleAttrib) {
            console.log(message.member);
            listRoles.forEach((r) => {
                const rd = message.member.roles.cache.find((role) => role.name === r.nom);
                if (rd) message.member.roles.remove(rd);
            });

            var role = message.member.guild.roles.cache.find(
                (role) => role.name === roleAttrib.nom
            );
            if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
            message.reply(`Le role **${roleAttrib.nom}** vous a été atribué!`);
            return;
        } else message.reply("Désolé, le role n'a pas été reconnu. Réessayez.");
    },
};

function IdentifierRole(args) {
    var roleAttrib = null;
    listRoles.forEach((role) => {
        if (roleAttrib) return;
        if (role.nom.toLowerCase().startsWith(args[0].toLowerCase())) {
            roleAttrib = role;
        }
        var joinArgs = args
            .join(" ")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        role.regex.forEach((rx) => {
            if (rx.test(joinArgs)) {
                roleAttrib = role;
                return;
            }
        });
    });
    return roleAttrib;
}
