import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday"; 
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/en-gb";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekday);

dayjs.locale("en-gb");

export default dayjs;
