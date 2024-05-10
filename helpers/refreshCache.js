import config from "../config.js";
import fs from "fs/promises";
import getServerDataFromSheet from "../google/getServerDataFromSheet.js";
import log from "../log.js";

export default async () => {
	log("cache", "Refreshing cache");

	const serverData = await getServerDataFromSheet("Sundays");

	await fs.writeFile(config.cacheFilePath, JSON.stringify(serverData));
};
