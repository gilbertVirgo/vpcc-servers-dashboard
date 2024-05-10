import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import dotenv from "dotenv";
import fs from "fs";
import getDirname from "../helpers/getDirname.js";
import { google } from "googleapis";
import path from "path";

dayjs.extend(customParseFormat);

dotenv.config();

const credentials = JSON.parse(
	fs.readFileSync(
		path.join(getDirname(import.meta.url), "./credentials.json")
	)
);

const auth = new google.auth.GoogleAuth({
	credentials,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const ignoredColumnIndeces = [0, 1];

const parseDataFromGoogleSheets = (allRows) => {
	const serverData = {};
	let [titleRow, ...rows] = allRows;

	rows.forEach((row) => {
		const rowDate = dayjs(
			row[titleRow.indexOf("Date")],
			"D MMMM YYYY"
		).format("YYYY-MM-DD");
		serverData[rowDate] = {};

		row.forEach((value, index) => {
			if (ignoredColumnIndeces.includes(index) || !value) return;

			serverData[rowDate][titleRow[index]] = value;
		});
	});

	return serverData;
};

export default (spreadsheetTitle) =>
	new Promise((resolve, reject) =>
		google.sheets({ version: "v4", auth }).spreadsheets.values.get(
			{
				spreadsheetId: process.env.GOOGLE_SHEET_ID,
				range: `${spreadsheetTitle}!A1:Z`,
			},
			(err, { data: { values } }) => {
				if (err) reject(err);

				resolve(parseDataFromGoogleSheets(values));
			}
		)
	);
