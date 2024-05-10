import config from "../config.js";
import fs from "fs/promises";
import log from "../log.js";

export default async () => {
	log("cache", "Reading cached data");

	const fileContents = await fs.readFile(config.cacheFilePath);
	return JSON.parse(fileContents);
};
