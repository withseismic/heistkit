import xml2js from 'xml2js'

/**
 * Parses an XML string into a JavaScript object.
 *
 * @param xml - The XML string to be parsed.
 * @returns A promise that resolves to the parsed JavaScript object.
 */

const parseXml = async (xml: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}
export { parseXml }
