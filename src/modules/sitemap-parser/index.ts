import { parseXml } from '../../utility/parse-xml'
import { SitemapItem } from './sitemap-parser.types'

/**
 * Retrieves the sitemaps from a given domain URL.
 *
 * @param domainUrl - The URL of the domain.
 * Assumes that the domain's robots.txt file contains a list of sitemap URLs. Will not work if the sitemap URLs are not listed in the robots.txt file.
 * @returns A promise that resolves to an object containing the sitemap URLs and their nested sitemaps.
 */
const getSitemaps = async (domainUrl: string): Promise<Record<string, string[]>> => {
    const response = await fetch(`${domainUrl}/robots.txt`)
    const text = await response.text()
    const lines = text.split('\n')
    const sitemapUrls = lines
        .filter((line) => line.startsWith('Sitemap:'))
        .map((line) => line.split('Sitemap:')[1].trim())

        if (sitemapUrls.length === 0) {
            throw new Error('No sitemap URLs found in robots.txt. Manually specify the sitemap URLs using parseSitemap(sitemapUrl) instead.')
        }

    const sitemaps: Record<string, string[]> = {}

    for (const sitemapUrl of sitemapUrls) {
        const response = await fetch(sitemapUrl)
        const xml = await response.text()
        const result = await parseXml(xml)

        if (result.sitemapindex) {
            // Nested sitemaps
            const nestedSitemaps = result.sitemapindex.sitemap.map((sitemap: any) => sitemap.loc[0])
            sitemaps[sitemapUrl] = nestedSitemaps
        } else {
            // Single sitemap
            sitemaps[sitemapUrl] = []
        }
    }

    return sitemaps
}

const parseSitemap = async (sitemapUrl: string): Promise<any[]> => {
    try {
        const response = await fetch(sitemapUrl)
        if (!response.ok) {
            throw new Error(`Failed to fetch sitemap: ${response.statusText}`)
        }
        const xml = await response.text()
        const result = await parseXml(xml)

        if (result.sitemapindex) {
            // Sitemap contains other sitemaps
            const nestedSitemaps = result.sitemapindex.sitemap.map((sitemap: any) => sitemap.loc[0])
            const nestedUrls = await Promise.all(nestedSitemaps.map(parseSitemap))
            return [{ parent: sitemapUrl, children: nestedUrls }]
        } else if (result.urlset) {
            // Sitemap contains URLs
            const urls = result.urlset.url.map((url: any) => url.loc[0])
            return [{ parent: sitemapUrl, children: urls }]
        } else {
            throw new Error('Invalid sitemap format')
        }
    } catch (error) {
        console.error(`Error parsing sitemap at ${sitemapUrl}:`, error)
        return [] // Return an empty array in case of an error
    }
}

/**
 * Fetches and organizes the contents of a sitemap from a given domain URL.
 * This function can return the sitemap contents either as a nested structure or as a flat list of URLs.
 *
 * @param domainUrl - The base URL of the domain whose sitemap is to be fetched.
 * @param flat - A boolean flag indicating whether to flatten the sitemap into a list of URLs, default is false.
 * @returns A promise that resolves to an array of SitemapItems.
 *
 * @example
 * // Fetching a nested sitemap structure
 * getSitemapContents('https://example.com').then(contents => {
 *     console.log(contents);
 * });
 *
 * @example
 * // Fetching a flat list of URLs from the sitemap
 * getSitemapContents('https://example.com', true).then(contents => {
 *     console.log(contents);
 * });
 */

const parseDomain = async (domainUrl: string, flat: boolean = false): Promise<SitemapItem[]> => {
    const sitemaps = await getSitemaps(domainUrl)
    const sitemapContents: SitemapItem[] = []

    for (const [parentUrl, childUrls] of Object.entries(sitemaps)) {
        const parsedUrls =
            childUrls.length > 0
                ? await Promise.all(childUrls.map(parseSitemap)).then((urls) => urls.flat())
                : await parseSitemap(parentUrl)

        if (flat) {
            sitemapContents.push(
                ...parsedUrls.flatMap((item) => ('children' in item ? item.children : []))
            )
        } else {
            sitemapContents.push({
                parent: parentUrl,
                children: parsedUrls,
            })
        }
    }

    return sitemapContents
}

export { parseDomain, getSitemaps, parseSitemap }
export type { SitemapItem }
