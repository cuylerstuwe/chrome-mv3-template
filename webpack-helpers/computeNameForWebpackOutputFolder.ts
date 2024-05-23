export function computeNameForWebpackOutputFolder() {
	return `build-${process.env.NODE_ENV === "production" ? "prod" : "dev"}`;
}
