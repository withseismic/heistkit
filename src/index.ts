import { parseDomain } from './modules/sitemap-parser'

parseDomain('https://www.gambling.com').then((contents) => {
    console.log(contents)
})

export default { parseDomain }
export * from './types'
