import * as allListenerImports from "background/listeners";

export const allMessageTypes = {
    ...allListenerImports,
};

export type allMessageTypes = typeof allMessageTypes;

/**
 * To enable advanced typechecking and "goto definition" functionality, we need to define the types of all message types.
 * During development, we act as though all message types take a direct reference to a listener function.
 * This enables "goto definition" for VS Code.
 * WebStorm doesn't need this; It's able to infer what it should look up given a string (see e.g., e104263 in WebStorm).
 */
type AllMessageTypesDuringDevelopment = {
    [K in keyof allMessageTypes]: ReturnType<allMessageTypes[K]>;
};

/**
 * During the build, message types are transformed to reflect their own keys as the message type.
 */
type AllMessageTypesAfterBuild = {
    [K in keyof allMessageTypes]: K;
}
