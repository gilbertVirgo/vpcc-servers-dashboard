import getDirname from "./helpers/getDirname.js";
import path from "path";

export default {
	cacheFilePath: path.join(getDirname(import.meta.url), "cache.json"),
	roleColours: {
		Welcome: "#aaaaff",
		Preaching: "#aaffaa",
		"Worship Lead": "#ffaaaa",
		Away: "#eeeeee",
		Setup: "#ffaaff",
		Lyrics: "#ffffaa",
		Refreshments: "#aaffff",
		"Kids Lead": "#ddff99",
		"Kids Apprentice": "#ddff99",
		Soundcheck: "#99ddff",
	},
};
