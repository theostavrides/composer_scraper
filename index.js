const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');


// Fetches 
async function fetchHTML(url){
    const res = await fetch(url)
    const text = await res.text()
    const html = text.replace('<!DOCTYPE html>', '').trim()
    return html
}

// Converts HTML tabular data  JSON format
async function parseHTML(html){
    const $ = cheerio.load(html);
    const $tables = $('table')

    
    for (let $table of $tables) {
        const output = []

        const $headers = $('th', $table)
        const headers = []

        for (let header of $headers) {
            const headerText = $(header).text().trim()
            headers.push(headerText)
        }

        if (headers.includes('Catalog')) {
            continue
        }

        const $bodyRows = $('tbody tr', $table)

        for (let row of $bodyRows) {
            const data = $('td', row)
            const rowOutput = {}
            for (let i = 0; i < data.length; i++) {
                const datum = data[i]
                const text = $(datum, data).text().trim()
                rowOutput[headers[i]] = text
            }
            if (Object.keys(rowOutput).length > 0) {
                output.push(rowOutput)
            }
        }
    }
}

// takes a JSON array of compositions and saves it to PSQL
async function save({
    compositions_json
}){

}

// scrapes an IMSPL list of compositions by a composer and saves it do the db
async function process({
    composer,
    url,
}){
    const html = await fetchHTML(url)
    const json = parseHTML(html)
}

process({
    composer: 'Ludwig van Beethoven',
    url: 'https://imslp.org/wiki/List_of_works_by_Ludwig_van_Beethoven',
    // url: 'https://imslp.org/wiki/List_of_works_by_Frédéric_Chopin',
})


