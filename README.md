## Heistkit - The Real Growth Hackers Toolkit

![GitHub Badge](https://img.shields.io/github/stars/withseismic/heistkit?style=social&label=Star)

## Description

This is a robust starting point for building npm packages with TypeScript support, and `esbuild` for rapidfire scaffolding.

## Installation

To install this package, run the following command in your terminal:

```sh
npm install heistkit
```

> **Note:** This package is not yet published to npm. You can install it directly from GitHub by running `npm install withseismic/heistkit`.

## Usage

### `parseDomain(domainHref: string, flatten: boolean = false)`

A quick and dirty way to get all sitemap urls from a domain. Supports multiple and nested sitemaps. Assumes that the domains robots.txt file is accessible and contains a sitemap directive. This function will return an array of objects, each containing a parent sitemap and an array of children sitemaps.

> If robots.txt doesnt contain sitemap entries, you can parse a sitemap.xml url using the `parseSitemap` function, below.

```typescript
import { parseDomain } from 'heistkit';

const results = await parseDomain('https://www.gambling.com', false) // set to true to flatten the results.
results = [
    {
        "parent": "https://www.gambling.com/sitemap-index.xml",
        "children": [
            {
                "parent": "https://www.gambling.com/sitemap.xml",
                "children": [ ... ] // 300 Items
            },
            {
                "parent": "https://www.gambling.com/ca/sitemap.xml",
                "children":
                [
                    "https://www.gambling.com/ca",
                    "https://www.gambling.com/ca/about-us",
                    "https://www.gambling.com/ca/bingo/fever-bingo",
                    "https://www.gambling.com/ca/bingo/zeus-bingo",
                    "https://www.gambling.com/ca/country-overviews",
                ...
                ]
            }
        ]
    }
]
```

### `parseSitemap(sitemapUrl: string)`

Parses a sitemap.xml uel and returns an array of urls.

```typescript
import { parseSitemap } from 'heistkit';

const results = await parseSitemap('https://www.gambling.com/sitemap.xml')
results = [
    "https://www.gambling.com",
    "https://www.gambling.com/about-us",
    "https://www.gambling.com/bingo/fever-bingo",
    "https://www.gambling.com/bingo/zeus-bingo",
    "https://www.gambling.com/country-overviews",
    ...
]
```

### `getSitemaps(domainHref: string)`

Grabs all sitemap urls from a domain's robots.txt file.

```typescript
import { getSitemaps } from 'heistkit';

const results = await getSitemaps('https://www.gambling.com')
results = [
    "https://www.gambling.com/sitemap-index.xml",
    "https://www.gambling.com/sitemap.xml",
    "https://www.gambling.com/ca/sitemap.xml",
    ...
]

```

## Contributing

If you find any problems, please [open an issue](https://github.com/withseismic/heistkit/issues) or submit a fix as a pull request.

## Support

Like the project? ⭐ Star the repository! It helps the project gain visibility and encourages others to contribute. If you'd like to support the project in other ways, consider becoming a sponsor on GitHub or buying me a coffee.

## Author

- [Doug Silkstone](https://twitter.com/dougiesilkstone)

## License

This project is licensed under the MIT License.
