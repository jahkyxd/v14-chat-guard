import { Client, GatewayIntentBits, Collection } from "discord.js";
import logger from "./logger.js";
import config from "../../config.js";
import db from "ceki.db";

class Jahky extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
            ],
        });
        this.config = global.config = config;
        global.system = this;
        this.logger = logger;
        this.db = global.db = db;
    }
}

export default Jahky;
