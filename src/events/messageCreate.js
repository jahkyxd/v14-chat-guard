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
const map = new Map();
const lımıt = 5;
const TIME = 10000;
const DIFF = 2000;

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("messageCreate", async (message) => {
        if (
            !message.guild ||
            !message.user.bot ||
            message.member.permissions.has("Administrator")
        )
            return;

        //*            SWEAR            \\
        if (
            swear.some((word) => message.content.toLowerCase().includes(word))
        ) {
            if (message.deletable) await message.delete();

            message.channel.send({
                content: `${message.author.toString()}, Sunucumuzda küfürlü sohbete izin verilmemektedir lütfen kelime seçiminize dikkat ediniz`,
            });
        }
        //*            SWEAR            \\

        //*            ADS            \\
        if (ads.some((word) => message.content.toLowerCase().includes(word))) {
            if (message.deletable) await message.delete();
            const adsData = client.db.get(`ads_${message.author.id}`);
            client.db.add(`ads_${message.author.id}`, 1);

            if (adsData === 1) {
                message.channel.send({
                    content: `${message.author.toString()}, Sunucumuzda reklam yapamazsın! Eğer bu dikkatsizliğin 2 kere daha tekrarlanırsa seni sunucudan yasaklayacağım.`,
                });
            }

            if (adsData === 2) {
                message.channel.send({
                    content: `${message.author.toString()}, Sunucumuzda reklam yapamazsın! Eğer bu dikkatsizliğin 1 kere daha tekrarlanırsa seni sunucudan yasaklayacağım.`,
                });
            }

            if (adsData === 3) {
                message.member.adsBan(client);
                message.channel.send({
                    content: `${message.author.tag} kişisine reklam yapmaması hakkında uyarmıştır ama beni kale almadı!`,
                });

                const DmRequest = message.author.createDM();
                DmRequest.send({
                    content: `${message.author.toString()}, Sunucumuzda reklam yapamazsın demiştim uyarıları dikkate almadın ve seni banladım`,
                });
            }
        }
        //*            ADS            \\

        //*            SPAM            \\
        if (message.member.roles.cache.get(client.config.Guild.MutedRole))
            return;
        if (map.has(message.author.id)) {
            const userData = map.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference =
                message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;

            if (difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    map.delete(message.author.id);
                }, TIME);
                map.set(message.author.id, userData);
            } else {
                msgCount++;
                if (parseInt(msgCount) === lımıt) {
                    message.member.roles.add(client.config.Guild.MutedRole);
                    message.channel.send({
                        content:
                            "Spam  yaptığından dolayı 15 dakika boyunca susturuldun.",
                    });

                    setTimeout(() => {
                        if (
                            !message.member.roles.cache.get(
                                client.config.Guild.MutedRole
                            )
                        )
                            return;
                        message.member.roles.remove(
                            client.config.Guild.MutedRole
                        );
                        message.channel.send({
                            content: "Muten açıldı lütfen tekrar spam yapma.",
                        });
                    }, 900000); //9000000
                } else {
                    userData.msgCount = msgCount;
                    map.set(message.author.id, userData);
                }
            }
        } else {
            let fn = setTimeout(() => {
                map.delete(message.author.id);
            }, TIME);
            map.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn,
            });
        }

        //*            SPAM            \\

        //*            ACTIVITY            \\
        if (
            message.channel.id === client.config.Guild.chat &&
            message.activity
        ) {
            if (message.deletable) await message.delete();

            message.channel.send({
                content: `${message.author.toString()}, Chat kanalında spotify parti isteği atamazsın!`,
            });
        }
        //*            ACTIVITY            \\
    });
};
