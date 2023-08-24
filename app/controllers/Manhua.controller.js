const axios = require('axios')
const cheerio = require('cheerio')
const Controller = require('../../core/Controller')
const { manhuaHomeUrl, baseUrl2 } = require('../constants/url')
const { mangaTrim, chapterTrim, cleanUrl } = require('../helpers/formatter')

class ManhuaController extends Controller {
    async all() {
        const { request } = this
        let { pageNumber } = request.params

        try {
            const dataResult = []
            // check if has pageNumber or not
            pageNumber = pageNumber || '1'
            // check if genres has parameter
            const url = (pageNumber === '1')
                ? `${baseUrl2}/pustaka/?orderby=modified&genre&genre2&status&category_name=manhua`
                : `${baseUrl2}/pustaka/page/${pageNumber}/?orderby=modified&genre&genre2&status&category_name=manhua`
            const { data } = await axios.get(url)
            const selector = cheerio.load(data)
            const root = selector('.perapih > section > .daftar > .bge')

            root.each((index, elm) => {
                const title = selector(elm).find('.kan > a > h3').text().trim()
                const thumb = selector(elm).find('.bgei > a > img').attr('data-@')
                const type = selector(elm).find('.bgei > a > div > b').text()
                const readerRelease = selector(elm).find('.kan > .judul2').text().split('•')
                const reader = readerRelease[0].trim().split(' ')[0].trim()
                const release = readerRelease[1].trim()
                const description = selector(elm).find('.kan > p').text().trim()
                const detailEndpoint = selector(elm).find('.bgei > a').attr('href')
                const firstChapter = selector(elm).find('.kan > .new1').first()
                    .find('a > span')
                    .last()
                    .text()
                const firstChapterEndpoint = selector(elm).find('.kan > .new1').first()
                    .find('a')
                    .attr('href')
                const lastChapter = selector(elm).find('.kan > .new1').last()
                    .find('a > span')
                    .last()
                    .text()
                const lastChapterEndpoint = selector(elm).find('.kan > .new1').last()
                    .find('a')
                    .attr('href')

                const obj = {}
                obj.title = title
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${cleanUrl(thumb)}`
                obj.type = type
                obj.reader = reader
                obj.release = release
                obj.description = description
                obj.detail_endpoint = mangaTrim(detailEndpoint)
                obj.first_chapter = firstChapter
                obj.first_chapter_endpoint = chapterTrim(firstChapterEndpoint)
                obj.last_chapter = lastChapter
                obj.last_chapter_endpoint = chapterTrim(lastChapterEndpoint)
                dataResult.push(obj)
            })

            return this.success(dataResult)
        } catch (err) {
            return this.error(null, err.message)
        }
    }

    async popular() {
        try {
            const { data } = await axios.get(manhuaHomeUrl)
            const selector = cheerio.load(data)
            const root = selector('#Trending > .perapih > .ls123 > .ls23')

            const dataResult = []
            root.each((index, elm) => {
                const title = selector(elm).find('h4').text().trim()
                const thumb = selector(elm).find('.ls23v > a > img').attr('data-@')
                const reader = selector(elm).find('.ls23t').first().text()
                const release = selector(elm).find('.ls23t').last().text()
                const detailEndpoint = selector(elm).find('.ls23v > a').attr('href')

                const obj = {}
                obj.title = title
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${cleanUrl(thumb)}`
                obj.type = 'Manhua'
                obj.reader = reader
                obj.release = release
                obj.detail_endpoint = mangaTrim(detailEndpoint)
                dataResult.push(obj)
            })

            return this.success(dataResult)
        } catch (err) {
            return this.error(null, err.message)
        }
    }

    async latest() {
        try {
            const { data } = await axios.get(manhuaHomeUrl)
            const selector = cheerio.load(data)
            const root = selector('#Terbaru > .ls4w > .ls4')

            const dataResult = []
            root.each((index, elm) => {
                const title = selector(elm).find('.ls4j > h4 > a').text()
                const thumb = selector(elm).find('.ls4v > a > img').attr('data-@')
                const typeRelease = selector(elm).find('.ls4j > .ls4s').text().split('•')
                const type = typeRelease[0].trim().split(' ')[0]
                const release = typeRelease[1].trim()
                const detailEndpoint = selector(elm).find('.ls4v > a').attr('href')
                const chapterEndpoint = selector(elm).find('.ls4j > a').attr('href')

                const obj = {}
                obj.title = title
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${cleanUrl(thumb)}`
                obj.type = type
                obj.release = release
                obj.detail_endpoint = mangaTrim(detailEndpoint)
                obj.chapter_endpoint = chapterTrim(chapterEndpoint)
                dataResult.push(obj)
            })

            return this.success(dataResult)
        } catch (err) {
            return this.error(null, err.message)
        }
    }
}

module.exports = ManhuaController
