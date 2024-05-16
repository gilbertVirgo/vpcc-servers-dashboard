import config from "./config.js";
import cron from "node-cron";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import getCachedData from "./helpers/getCachedData.js";
import getNextSunday from "./helpers/getNextSunday.js";
import getPrevSunday from "./helpers/getPrevSunday.js";
import getThisSunday from "./helpers/getThisSunday.js";
import html from "./html/index.js";
import https from "https";
import refreshCache from "./helpers/refreshCache.js";

dayjs.extend(customParseFormat);

dotenv.config();

const app = express();

cron.schedule("* * * * *", () => refreshCache());

const init = async () => {
	if (!fs.existsSync(config.privateDirectoryPath))
		fs.mkdirSync(config.privateDirectoryPath);

	await refreshCache();

	app.use(express.static("public"));

	app.use("/.well-known", express.static(".well-known"));

	app.get("/", (req, res) => {
		res.redirect("/" + getThisSunday());
	});

	app.get("/:date/prev", async (req, res) => {
		const date = dayjs(req.params.date, "YYYY-MM-DD");

		res.redirect("/" + getPrevSunday(date));
	});

	app.get("/:date/next", async (req, res) => {
		const date = dayjs(req.params.date, "YYYY-MM-DD");

		res.redirect("/" + getNextSunday(date));
	});

	app.get("/:date", async (req, res) => {
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

	const server = ((isSSLKeyAndCertAvailable) => {
		if (isSSLKeyAndCertAvailable) {
			console.log("Running SSL!");

			return https.createServer(
				{
					key: fs.readFileSync(process.env.SSL_KEY_PATH),
					cert: fs.readFileSync(process.env.SSL_CERT_PATH),
				},
				app
			);
		} else return app;
	})(!!process.env.SSL_KEY_PATH && !!process.env.SSL_CERT_PATH);

	server.listen(process.env.PORT, () =>
		console.log(`Server running on ${process.env.PORT}`)
	);
};

init();
