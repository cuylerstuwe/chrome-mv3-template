import { fetchWorldTime as networkFetchWorldTime } from "background/network/fetchWorldTime";
import type { WorldTime, WorldTimeEndpoint } from "background/network/fetchWorldTime";

/**
 * Provided as a simple demo of how we should implement a listener that fetches network data.
 */
export async function fetchWorldTime(endpoint: WorldTimeEndpoint = "ip"): Promise<WorldTime | undefined> {
	return networkFetchWorldTime(endpoint);
}
