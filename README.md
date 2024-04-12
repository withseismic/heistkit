# Heistkit - The Real Growth Hackers Toolkit

![GitHub Badge](https://img.shields.io/github/stars/withseismic/heistkit?style=social&label=Star)

Heistkit is a toolkit designed for deep diving into website structures through sitemap analysis. It provides essential functions to parse domain-specific sitemaps and extract URLs for further analysis.

## Installation

Step 1. Star the repository to show your support! ![GitHub Badge](https://img.shields.io/github/stars/withseismic/heistkit?style=social&label=Star)

To install this package, run the following command in your terminal:

```sh
npm install heistkit
```

> **Node 17+ Required:** This package uses global fetch, which is only available in Node 17 and later.

## Usage

The `heistkit` package provides several utility functions under the `sitemap` module for extracting and parsing sitemap data. Below is a table of available functions:

| Module   | Function Example                                                     | Description                                                                                     |
|----------|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| sitemap  | `await parseDomain('https://www.example.com', false)`                | Parses all sitemap URLs from a given domain, supporting nested and multiple sitemap structures. |
| sitemap  | `await parseSitemap('https://www.example.com/sitemap.xml')`          | Parses a specific sitemap.xml URL and returns an array of URLs.                                 |
| sitemap  | `await getSitemaps('https://www.example.com')`                       | Retrieves all sitemap URLs listed in a domain's robots.txt file.                                |

### Detailed Function Descriptions

#### `parseDomain(domainHref: string, flatten: boolean = false)`

Parses all sitemap URLs from a given domain. It supports nested and multiple sitemap structures, providing a hierarchical or flat list based on the `flatten` flag. The function returns an array of objects containing parent and child URLs.

> **Note:** This assumes the domain has a robots.txt file with sitemap URLs listed. If not, manually grab sitemaps and parse them with the parseSitemap function to retrieve sitemap URLs.
> **Note:** The `flatten` flag is optional and defaults to `false`. When set to `true`, the function returns a flat list of URLs.

```typescript
import { parseDomain } from 'heistkit';
const results = await parseDomain('https://www.example.com', false);

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

#### `parseSitemap(sitemapUrl: string)`

Parses a specific sitemap.xml URL and returns an array of URLs extracted from the sitemap.

```typescript
import { parseSitemap } from 'heistkit';
const results = await parseSitemap('https://www.example.com/sitemap.xml');
results = [
    "https://www.gambling.com",
    "https://www.gambling.com/about-us",
    "https://www.gambling.com/bingo/fever-bingo",
    "https://www.gambling.com/bingo/zeus-bingo",
    "https://www.gambling.com/country-overviews",
    ...
]

```

#### `getSitemaps(domainHref: string)`

Retrieves all sitemap URLs listed in a domain's robots.txt file. This function is useful for initial sitemap discovery.

```typescript
import { getSitemaps } from 'heistkit';
const results = await getSitemaps('https://www.example.com');
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
