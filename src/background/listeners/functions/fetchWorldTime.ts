import { fetchWorldTime as networkFetchWorldTime } from "background/network/fetchWorldTime";
import type { RawWorldTime, WorldTimeEndpoint } from "background/network/fetchWorldTime";

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
	? `${T}${Capitalize<SnakeToCamelCase<U>>}`
	: S;

type SnakeToCamelCaseKeys<T> = {
	[K in keyof T as SnakeToCamelCase<K & string>]: T[K];
};

export type WorldTime = SnakeToCamelCaseKeys<RawWorldTime> & { asFormattedTime: string };

/**
 * Provided as a simple demo of how we should implement a listener that fetches network data.
 */
export async function fetchWorldTime(endpoint: WorldTimeEndpoint = "ip"): Promise<WorldTime | undefined> {
	const responsePayload = await networkFetchWorldTime(endpoint);
	if (responsePayload !== undefined) {
		/**
		 * Yes, it's a little tedious, but this is a simple way to convert snake_case keys to camelCase once for demo purposes.
		 * The purpose is to illustrate that we should not directly expose a raw network response payload to the foreground.
		 */
		const worldTime: WorldTime = {
			abbreviation: responsePayload.abbreviation,
			clientIp: responsePayload.client_ip,
			datetime: responsePayload.datetime,
			dayOfWeek: responsePayload.day_of_week,
			dayOfYear: responsePayload.day_of_year,
			dst: responsePayload.dst,
			dstFrom: responsePayload.dst_from,
			dstOffset: responsePayload.dst_offset,
			dstUntil: responsePayload.dst_until,
			rawOffset: responsePayload.raw_offset,
			timezone: responsePayload.timezone,
			unixtime: responsePayload.unixtime,
			utcDatetime: responsePayload.utc_datetime,
			utcOffset: responsePayload.utc_offset,
			weekNumber: responsePayload.week_number,
			/**
			 * Render the time in the format the user is most likely to understand.
			 */
			asFormattedTime: (() => {
				const date = new Date(responsePayload.utc_datetime);
				return date.toLocaleString();
			})(),
		};
		return worldTime;
	}
}
