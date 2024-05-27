# Network

## Naming

Within this folder:

Functions meant to retrieve data without side-effects should begin with `fetch` _(It may help to think of this in terms of the semantics of the HTTP verb `GET`)_.

By contrast, any function plausibly expected to mutate remote data or cause other side-effects should begin with `transmit` _(Think of this in terms of the semantics of most non-`GET` HTTP verbs, e.g., `POST`, `PUT`, `PATCH`, `DELETE`, etc.)_.

Following and remembering these two simple rules will help keep names concise, clear, and predictable.