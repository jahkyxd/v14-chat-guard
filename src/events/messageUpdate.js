import Jahky from "../Base/Jahky.Client.js";
const ads = new Array(
    "discord.app",
    "discord.gg",
    "discordapp",
    "discordgg",
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https",
    "http",
    ".gl",
    ".org",
    ".com.tr",
    ".biz",
    ".party",
    ".rf.gd",
    ".az",
    ".cf",
    ".me",
    ".in"
);
const swear = new Array(
    "oç",
    "amk",
    "ananı sikiyim",
    "ananıskm",
    "piç",
    "amk",
    "amsk",
    "sikim",
    "sikiyim",
    "orospu çocuğu",
    "piç kurusu",
    "kahpe",
    "orospu",
    "mal",
    "sik",
    "yarrak",
    "am",
    "amcık",
    "amık",
    "yarram",
    "sikimi ye",
    "mk",
    "mq",
    "aq",
    "ak",
    "amq"
);

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (
            !newMessage.guild ||
            newMessage.author.bot ||
            newMessage.member.permissions.has("Administrator")
        )
            if (
                swear.some(
                    (word) =>
                        !oldMessage.content.toLowerCase().includes(word) &&
                        newMessage.content.toLowerCase().includes(word)
                )
            ) {
                //*            SWEAR            \\
                if (newMessage.deletable) await newMessage.delete();

                newMessage.channel.send({
                    content: `${newMessage.author.toString()}, Sunucumuzda küfürlü sohbete izin verilmemektedir lütfen kelime seçiminize dikkat ediniz`,
                });
            }
        //*            SWEAR            \\

        //*            ADS            \\
        if (
            ads.some(
                (word) =>
                    !oldMessage.content.toLowerCase().includes(word) &&
                    newMessage.content.toLowerCase().includes(word)
            )
        ) {
            if (newMessage.deletable) await newMessage.delete();
            const adsData = client.db.get(`ads_${newMessage.author.id}`);
            client.db.add(`ads_${newMessage.author.id}`, 1);

            if (adsData === 1) {
                newMessage.channel.send({
                    content: `${newMessage.author.toString()}, Sunucumuzda reklam yapamazsın! Eğer bu dikkatsizliğin 2 kere daha tekrarlanırsa seni sunucudan yasaklayacağım.`,
                });
            }

            if (adsData === 2) {
                newMessage.channel.send({
                    content: `${newMessage.author.toString()}, Sunucumuzda reklam yapamazsın! Eğer bu dikkatsizliğin 1 kere daha tekrarlanırsa seni sunucudan yasaklayacağım.`,
                });
            }

            if (adsData === 3) {
                newMessage.member.adsBan(client);
                newMessage.channel.send({
                    content: `${newMessage.author.tag} kişisine reklam yapmaması hakkında uyarmıştır ama beni kale almadı!`,
                });

                const DmRequest = newMessage.author.createDM();
                DmRequest.send({
                    content: `${newMessage.author.toString()}, Sunucumuzda reklam yapamazsın demiştim uyarıları dikkate almadın ve seni banladım`,
                });
            }
        }
        //*            ADS            \\
    });
};
