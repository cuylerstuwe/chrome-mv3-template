/**
 * Provided as a demo of how to write a listener that does not perform async operations.
 * Note that this function is marked as async, regardless of whether it actually performs async operations.
 * This is to ensure that the function signature is consistent with other listeners.
 * @param a The first number.
 * @param b The second number.
 */
export async function sumTwoNumbers(a: number, b: number) {
	return a + b;
}
