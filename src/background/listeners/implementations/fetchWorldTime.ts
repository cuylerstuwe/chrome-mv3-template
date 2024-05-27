import { fetchWorldTime as networkFetchWorldTime } from "background/network/fetchWorldTime";
import type { WorldTimeEndpoint } from "background/network/fetchWorldTime";

export async function fetchWorldTime(endpoint: WorldTimeEndpoint = "ip") {
	return networkFetchWorldTime(endpoint);
}
