import { readdir, readdirSync } from "fs";
import Jahky from "./Jahky.Client.js";

class Load {
    /**
     *
     * @param {Jahky} client
     */

    static async LoadEvents(client) {
        readdir("./src/events", (err, files) => {
            if (err) console.log(err);
            files.forEach(async (file) => {
                const event = await import(`../events/global/${file}`).then(
                    (modules) => modules.default
                );
                event(client);
            });
        });
    }
}

export default Load;
