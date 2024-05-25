import { z } from "zod";

const WorldTime = z.object({
	/**
	 * The abbreviated time of the timezone.
	 */
	abbreviation: z.string(),
	/**
	 * The IP of the client making the request.
	 */
	client_ip: z.string().ip(),
	/**
	 * An ISO8601-valid string representing the current local date/time.
	 */
	datetime: z.string(),
	/**
	 * Current day number of the week, where sunday is 0 and saturday is 6.
	 */
	day_of_week: z.number().lt(8),
	/**
	 * Ordinal day of the current year.
	 * Generally 1-365, but can be 366 on leap years.
	 */
	day_of_year: z.number().lt(367),
	/**
	 * Flag indicating whether the local time is in daylight savings.
	 */
	dst: z.boolean(),
	/**
	 * An ISO8601-valid string representing the datetime
	 * when daylight savings started for this timezone.
	 */
	dst_from: z.string().nullable(),
	/**
	 * The difference in seconds between the current local time
	 * and daylight savings time for this location.
	 */
	dst_offset: z.number().int(),
	/**
	 * An ISO8601-valid string representing the datetime
	 * when daylight savings will end for this timezone.
	 */
	dst_until: z.string().nullable(),
	/**
	 * The difference in seconds between the current local time
	 * and the time in UTC,
	 * excluding any daylight saving difference (see dst_offset).
	 */
	raw_offset: z.number().int(),
	/**
	 * Timezone in `Area/Location` or`Area/Location/Region` format.
	 */
	timezone: z.string(),
	/**
	 * Number of seconds since the Epoch.
	 */
	unixtime: z.number().int(),
	/**
	 * An ISO8601-valid string representing the current date/time in UTC.
	 */
	utc_datetime: z.string(),
	/**
	 * An ISO8601-valid string representing the offset from UTC.
	 */
	utc_offset: z.string().refine((value) => value.match(/^[\+\-]?\d{2}:\d{2}$/) !== null),
	/**
	 * The current week number.
	 */
	week_number: z.number().lt(53),
});

type WorldTime = z.infer<typeof WorldTime>;

export type WorldTimeEndpoint = "ip" | `timezone/${string}/${string}` | `timezone/${string}/${string}/${string}`;

/**
 * A simple API to get the current time based on
 * a request with a timezone.
 * @param endpoint
 * @see https://worldtimeapi.org/api
 */
export async function fetchWorldTime(endpoint: WorldTimeEndpoint = "ip"): Promise<WorldTime | undefined> {
	try {
		const urlBase = "https://worldtimeapi.org/api";
		const response = await fetch(`${urlBase}/${endpoint}`);
		const data = await response.json();
		WorldTime.parse(data);
		return data as WorldTime;
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			console.error(error.errors);
		}
	}
}
