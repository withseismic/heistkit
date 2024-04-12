/**
 * Represents a single item in a sitemap, which could be a parent with its corresponding children.
 * Each child could be a simple URL string or a nested SitemapItem.
 */
export interface SitemapItem {
    parent: string
    children: string[] | SitemapItem[]
}