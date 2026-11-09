# Browser regression tests

Install the test dependencies and Chromium, then run the tests:

```sh
npm ci
npx playwright install chromium
npm test
```

Alternatively, use an existing Chrome installation:

```sh
CHROME_PATH=/path/to/google-chrome npm test
```

The tests open the real portfolio HTML locally and block external requests so
third-party embeds and fonts do not affect the results.
