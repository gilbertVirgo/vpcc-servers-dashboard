const html = String.raw;

export default (content) => html`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<link rel="stylesheet" href="/main.css" />
			<title>VPCC Servers</title>
		</head>
		<body>
			<main>${content}</main>
		</body>
	</html>
`;
