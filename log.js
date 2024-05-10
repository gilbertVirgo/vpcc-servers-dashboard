import dayjs from "dayjs";
import fs from "fs";
import getDirname from "./helpers/getDirname.js";
import path from "path";

export default (type, message, eventDescriptor = " ") => {
	if (typeof message === "object") message = JSON.stringify(message);

	const logDirPath = path.join(getDirname(import.meta.url), "log");

	if (!fs.existsSync(logDirPath)) fs.mkdirSync(logDirPath);

	const logFilePath = path.join(logDirPath, `${type}.log`);

	fs.appendFileSync(
		logFilePath,
		`[${dayjs().format("DD/MM/YYYY HH:mm:ss")}]` +
			eventDescriptor +
			`${message}\r\n`
	);
};
