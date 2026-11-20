# Tests

Run with Node.js 22 or newer; no dependencies or installation are required:

```sh
node --test tests/*.test.cjs
```

This static site had no test runner or test conventions. These tests use Node's
built-in runner and execute the actual inline script from `index.html` in an
isolated VM with small DOM, storage, and scheduling doubles. Production code is
not copied or changed to make it testable.

The focused risk areas are persisted theme preferences and the first-visit
loader: invalid saved values, unavailable/throwing storage, accessible theme
state after clicks, persistence across visits, reduced motion, and completion
of the loader so it cannot obscure the page indefinitely. There is no local
payment, authentication, or form-submission code in this repository.

These are logic tests, not browser or visual tests. They do not cover native
browser event timing, project-preview dialogs, reveal animations, or third-party
embeds.
