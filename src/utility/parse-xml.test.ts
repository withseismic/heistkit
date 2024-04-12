import { parseXml } from './parse-xml'

describe('parseXml', () => {
    it('should parse XML string into an object', async () => {
        const xml = '<root><name>John Doe</name></root>'
        const result = await parseXml(xml)
        expect(result).toEqual({ root: { name: ['John Doe'] } })
    })

    it('should reject with an error if XML parsing fails', async () => {
        const xml = '<invalid-xml>'
        await expect(parseXml(xml)).rejects.toThrow()
    })
})
