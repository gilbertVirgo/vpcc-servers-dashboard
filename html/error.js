import wrapper from "./wrapper.js";

const html = String.raw;

export default (content) =>
	wrapper(html`
		<header>
			<h1>Error</h1>
			<p>${content}</p>
		</header>
		<section>
			<a href="/" class="button">Back to this Sunday</a>
		</section>
	`);
