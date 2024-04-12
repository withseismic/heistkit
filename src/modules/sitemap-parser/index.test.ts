import { parseXml } from '../../utility/parse-xml'
import { getSitemaps } from './index'

jest.mock('../../utility/parse-xml', () => ({
    parseXml: jest.fn(),
}))

describe('parseDomain', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        ;(parseXml as jest.Mock).mockClear()
    })

    it('should fetch and parse sitemaps from robots.txt', async () => {
        const domainUrl = 'https://example.com'
        const robotsTxt = `User-agent: *
Sitemap: ${domainUrl}/sitemap1.xml
Sitemap: ${domainUrl}/sitemap2.xml`

        const fetchMock = jest.fn()
        fetchMock.mockResolvedValueOnce({ text: () => Promise.resolve(robotsTxt) })
        fetchMock.mockResolvedValueOnce({
            text: () =>
                Promise.resolve(
                    '<sitemapindex><sitemap><loc>https://example.com/nested-sitemap.xml</loc></sitemap></sitemapindex>'
                ),
        })
        fetchMock.mockResolvedValueOnce({ text: () => Promise.resolve('<urlset></urlset>') })

        ;(parseXml as jest.Mock).mockResolvedValueOnce({
            sitemapindex: { sitemap: [{ loc: ['https://example.com/nested-sitemap.xml'] }] },
        })
        ;(parseXml as jest.Mock).mockResolvedValueOnce({})

        global.fetch = fetchMock

        const result = await getSitemaps(domainUrl)

        expect(fetchMock).toHaveBeenCalledTimes(3)
        expect(fetchMock).toHaveBeenCalledWith(`${domainUrl}/robots.txt`)
        expect(fetchMock).toHaveBeenCalledWith(`${domainUrl}/sitemap1.xml`)
        expect(fetchMock).toHaveBeenCalledWith(`${domainUrl}/sitemap2.xml`)

        expect(parseXml).toHaveBeenCalledTimes(2)
        expect(parseXml).toHaveBeenCalledWith(
            '<sitemapindex><sitemap><loc>https://example.com/nested-sitemap.xml</loc></sitemap></sitemapindex>'
        )
        expect(parseXml).toHaveBeenCalledWith('<urlset></urlset>')

        expect(result).toEqual({
            [`${domainUrl}/sitemap1.xml`]: [`${domainUrl}/nested-sitemap.xml`],
            [`${domainUrl}/sitemap2.xml`]: [],
        })
    })
})
