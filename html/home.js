import config from "../config.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import dayjs from "dayjs";
import error from "./error.js";
import wrapper from "./wrapper.js";

dayjs.extend(customParseFormat);

const html = String.raw;

export default ({ date, canNext, canPrev, serverData }) => {
	if (!serverData) return error("No data returned from Google Sheets");

	if (!serverData.hasOwnProperty(date))
		return error("No roles found for given date");

	return wrapper(html`
		<header>
			<h1>Servers</h1>
			<h2>${dayjs(date, "YYYY-MM-DD").format("dddd D MMMM")}</h2>
		</header>
		<section>
			<table>
				<tbody>
					${Object.entries(serverData[date])
						.map(
							([name, role]) => html` <tr>
								<td>${name}</td>
								<td
									style="background-color: ${config
										.roleColours[role]}"
								>
									${role}
								</td>
							</tr>`
						)
						.join("")}
				</tbody>
			</table>
		</section>
		<section style="flex-direction: row;">
			${canPrev
				? html`<a href="/${date}/prev" class="button"
						>← Previous week</a
				  >`
				: ``}
			${canNext
				? html`<a href="/${date}/next" class="button">Next week →</a>`
				: ``}
		</section>
	`);
};
