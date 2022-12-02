import { GuildMember, EmbedBuilder } from "discord.js";
import Jahky from "../Base/Jahky.Client.js";

//! prototype functions \\

/**
 * @param {Jahky} client
 */

GuildMember.prototype.adsBan = async function (client) {
    if (this.bannable) this.ban({ reason: "Jahky. Chat Guard (reklam)" });

    client.db.delete(`ads_${this.user.id}`);
};

Array.prototype.random = async function () {
    return this[Math.floor(Math.random() * this.length)];
};
