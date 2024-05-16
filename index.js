import config from "./config.js";
import cron from "node-cron";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import getCachedData from "./helpers/getCachedData.js";
import getDirname from "./helpers/getDirname.js";
import getNextSunday from "./helpers/getNextSunday.js";
import getPrevSunday from "./helpers/getPrevSunday.js";
import getThisSunday from "./helpers/getThisSunday.js";
import html from "./html/index.js";
import path from "path";
import refreshCache from "./helpers/refreshCache.js";

dayjs.extend(customParseFormat);

dotenv.config();

const server = express();

cron.schedule("* * * * *", () => refreshCache());

const init = async () => {
	if (!fs.existsSync(config.privateDirectoryPath))
		fs.mkdirSync(config.privateDirectoryPath);

	await refreshCache();

	server.use(express.static("public"));

	server.use("/.well-known", express.static(".well-known"));

	server.get("/", (req, res) => {
		res.redirect("/" + getThisSunday());
	});

	server.get("/:date/prev", async (req, res) => {
		const date = dayjs(req.params.date, "YYYY-MM-DD");

		res.redirect("/" + getPrevSunday(date));
	});

	server.get("/:date/next", async (req, res) => {
		const date = dayjs(req.params.date, "YYYY-MM-DD");

		res.redirect("/" + getNextSunday(date));
	});

	server.get("/:date", async (req, res) => {
		const date = dayjs(req.params.date, "YYYY-MM-DD");

		if (date.isBefore(dayjs(), "day"))
			return res.redirect("/" + getThisSunday());

		const serverData = await getCachedData();

		res.send(
			html.home({
				date: req.params.date,
				canPrev:
					!dayjs(getPrevSunday(date)).isBefore(dayjs(), "day") &&
					serverData.hasOwnProperty(getPrevSunday(date)),
				canNext: serverData.hasOwnProperty(getNextSunday(date)),
				serverData,
			})
		);
	});

	server.listen(process.env.PORT, () =>
		console.log(`Server running on ${process.env.PORT}`)
	);
};

init();
