# Listeners

## Naming

Within the `./functions/` subfolder:

Each file should contain exactly one named export, which should be an async function.

The name of this function will become enforced by Typescript as the name of the message dispatched from the foreground.

As a convention for consistency's sake, the filename should match the name of this named export _(including casing)_.

## Notes

**IMPORTANT**: If you do not import a function from `./functions/` into `index.ts`, it will not be registered as a listener.