import getDirname from "./helpers/getDirname.js";
import path from "path";

const __dirname = getDirname(import.meta.url),
	privateDirectoryPath = path.join(__dirname, "private");

export default {
	privateDirectoryPath,
	cacheFilePath: path.join(privateDirectoryPath, "cache.json"),
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
