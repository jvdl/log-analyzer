# Getting started

`npm install` to install dependencies

`npm start` to start the server

# Assumptions

Files uploaded are in the correct formatting using standard web log format, e.g.

```
177.71.123.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
```

Some checks will be made, e.g. file size, some basic file type checking, but not all possible checks are implemented.

# Tests

Tests are run with Vitest, `npm test` to run tests
