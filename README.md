# `micro-snaps` ;)

A simple microservice that uses the `google-chrome` headless server to take snapshots of websites.

## Build the service

Includes a `docker-compose` file for development. Or use the included `./run` command.

In production, you must use the `--cap-add=SYS_ADMIN` (at the minimum) or else the `google-chrome` command will not work.

## Usage

`https://micro-snaps.domain.com/?url={domain}&viewport={viewportString}`

### Options

`url` - Required.

The url of the page you would like to take a screenshot of.

`viewport` - Optional (default: 1200)

`pixelRatio` - Optional (default: 1)

`wsEndpoint` - Optional

The dimensions of the window you would like the app to use, in a comma seperated *W,H* string. For example for a window of 1200 x 900, you would pass `viewport=1200,900`.