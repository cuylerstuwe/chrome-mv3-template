# Network

## Naming

Within this folder:

Functions which are expected only to retrieve data from the network without mutating it _(e.g., keeping with the semantics of the `GET` verb)_ should begin with `fetch`.

By contrast, any function which could plausibly mutate remote data or cause other side-effects should begin with `transmit`.

Following and remembering these two simple rules will help keep names concise, clear, and predictable.