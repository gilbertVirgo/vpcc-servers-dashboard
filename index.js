import cron from "node-cron";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
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
	await refreshCache();

	const mainCSSFile = await fs.readFile(
		path.join(getDirname(import.meta.url), "main.css")
	);

	server.get("/css", (req, res) => {
		res.setHeader("Content-Type", "text/css");
		res.send(mainCSSFile);
	});

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

		// Optimization suggestion: fetch the serverData and store
		// in a local file (perhaps every 60 seconds). Then read
		// the local file on GET /:date for considerably quicker
		// load times on the client.

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
