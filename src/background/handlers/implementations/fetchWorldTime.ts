import { fetchWorldTime as networkFetchWorldTime } from "background/network/fetchWorldTime";

export async function fetchWorldTime() {
	return networkFetchWorldTime();
}
