import { z } from "zod";

const WorldTime = z.object({
	abbreviation: z.string(),
	client_ip: z.string().ip(),
	datetime: z.string().datetime(),
	day_of_week: z.number().lt(8),
	day_of_year: z.number().lt(367),
	dst: z.boolean(),
	dst_from: z.string().datetime(),
	dst_offset: z.number().int(),
	dst_until: z.string().datetime(),
	raw_offset: z.number().int(),
	timezone: z.string(),
	unixtime: z.number().int(),
	utc_datetime: z.string().datetime(),
	utc_offset: z.string().refine((value) => value.match(/^[\+\-]?\d{2}:\d{2}$/) !== null),
	week_number: z.number().lt(53),
});

type WorldTime = z.infer<typeof WorldTime>;

export async function fetchWorldTime(): Promise<WorldTime> {
	const response = await fetch("https://worldtimeapi.org/api/ip");
	const data = await response.json();
	WorldTime.parse(data);
	return data as WorldTime;
}
