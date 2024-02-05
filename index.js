const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');


// Fetches html from a url
async function fetchHTML(url){
    const res = await fetch(url)
    const text = await res.text()
    const html = text.replace('<!DOCTYPE html>', '').trim()
    return html
}

// Converts HTML tabular data to an array of objects
function parseHTML(html){
    const $ = cheerio.load(html);
    const $tables = $('table')
    const response = []
    
    for (let $table of $tables) {
        const output = []

        const $headers = $('th', $table)
        const headers = []

        for (let header of $headers) {
            const headerText = $(header).text().trim()
            headers.push(headerText)
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

        response.push({
            headers,
            data: output
        })
    }

    return response
}

async function start() {
    const pages = [
        {
            composer: 'Ludwig van Beethoven',
            url: 'https://imslp.org/wiki/List_of_works_by_Ludwig_van_Beethoven',
        },
        {
            composer: 'Frédéric Chopin',
            url: 'https://imslp.org/wiki/List_of_works_by_Frédéric_Chopin'
        },
        {
            composer: 'Wolfgang Amadeus Mozart',
            url: 'https://imslp.org/wiki/List_of_works_by_Wolfgang_Amadeus_Mozart'
        },
        {
            composer: 'Johann Sebastian Bach',
            url: 'https://imslp.org/wiki/List_of_works_by_Johann_Sebastian_Bach'
        },
        {
            composer: 'Pyotr Tchaikovsky',
            url: 'https://imslp.org/wiki/List_of_works_by_Pyotr_Tchaikovsky'
        },
        {
            composer: 'Johannes Brahms',
            url: 'https://imslp.org/wiki/List_of_works_by_Johannes_Brahms',
        },
        {
            composer: 'Antonio Vivaldi',
            url: 'https://imslp.org/wiki/List_of_works_by_Antonio_Vivaldi',
        },
        {
            composer: 'Joseph Haydn',
            url: 'https://imslp.org/wiki/List_of_works_by_Joseph_Haydn',
        },
        {
            composer: 'Gustav Mahler',
            url: 'https://imslp.org/wiki/List_of_works_by_Gustav_Mahler',
        },
        {
            composer: 'Franz Schubert',
            url: 'https://imslp.org/wiki/List_of_works_by_Franz_Schubert',
        },
        {
            composer: 'Felix Mendelssohn',
            url: 'https://imslp.org/wiki/List_of_works_by_Felix_Mendelssohn',
        },
        {
            composer: 'Antonín Dvořák',
            url: 'https://imslp.org/wiki/List_of_works_by_Antonín_Dvořák',
        },
        {
            composer: 'Sergei Rachmaninoff',
            url: 'https://imslp.org/wiki/List_of_works_by_Sergei_Rachmaninoff',
        },
    ]

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (const page of pages) {
        const { composer, url } = page
        const html = await fetchHTML(url)
        const parsed = parseHTML(html)
        console.log('------------------------------------')
        console.log('~')
        console.log(composer)
        console.log('~\n\n')
        console.log(parsed)
        await sleep(1000)
    }
}

start()



