import { getSitemaps, parseDomain, parseSitemap } from './modules/sitemap-parser'

// parseDomain('https://www.gambling.com').then((contents) => {
//     console.log(contents)
// })

export default { parseDomain, parseSitemap,  getSitemaps }
export * from './types'
