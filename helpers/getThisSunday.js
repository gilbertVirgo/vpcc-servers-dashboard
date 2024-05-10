import dayjs from "dayjs";

export default () => {
	let thisSunday = dayjs()
		.add(1, "week")
		.startOf("week")
		.format("YYYY-MM-DD");

	// Unless today is Sunday, in which case set 'thisSunday' to today
	if (dayjs().day() === 0) thisSunday = dayjs().format("YYYY-MM-DD");

	return thisSunday;
};
