const axios = require('axios')
const cheerio = require('cheerio')
const Controller = require('cores/Controller')
const { baseUrl, baseUrl2 } = require('constants/url')
const { chapterTrim, mangaTrim, cleanUrl } = require('helpers/formatter')
class HomeController extends Controller {
    async popular() {
        try {
            const { data } = await axios.get(baseUrl)
            const selector = cheerio.load(data)
            const root = selector('#Trending > .perapih > .ls123 > .ls23')

            const dataResult = []
            await root.each((index, elm) => {
                const title = selector(elm).find('h4').text().trim()
                const thumb = selector(elm).find('.ls23v > a > img').attr('src')
                const type = selector(elm).find('.ls23v > a > div').attr('class');
                const reader = selector(elm).find('.ls23t').first().text()
                const release = selector(elm).find('.ls23t').last().text()
                const detailEndpoint = selector(elm).find('.ls23v > a').attr('href')
                const chapterEndpoint = selector(elm).find('.ls23j > a').attr('href')

                const obj = {}
                obj.title = title
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${thumb}`
                obj.type = type
                obj.reader = reader
                obj.release = release
                obj.detail_endpoint = mangaTrim(detailEndpoint)
                obj.chapter_endpoint = chapterTrim(chapterEndpoint)
                
                dataResult.push(obj)
            })
            if (dataResult.length < 1) return this.error(null, "something error!")
            return this.success(dataResult)

        } catch (err) {
            return this.error(null, err.message)
        }
    }

    async latest() {
        try {
            const { data } = await axios.get(baseUrl)
            const selector = cheerio.load(data)
            const root = selector('#Terbaru > .ls4w > .ls4')

            const dataResult = []
            await root.each((index, elm) => {
                const title = selector(elm).find('.ls4j > h4 > a').text()
                const thumb = selector(elm).find('.ls4v > a > img').attr('src')
                const typeRelease = selector(elm).find('.ls4j > .ls4s').text().split('•')
                const type = typeRelease[0].trim().split(' ')[0]
                const release = typeRelease[1].trim()
                const detailEndpoint = selector(elm).find('.ls4v > a').attr('href')
                const chapterEndpoint = selector(elm).find('.ls4j > a').attr('href')

                const obj = {}
                obj.title = title
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${thumb}`
                obj.type = type
                obj.release = release
                obj.detail_endpoint = mangaTrim(detailEndpoint)
                obj.chapter_endpoint = chapterTrim(chapterEndpoint)
                dataResult.push(obj)
            })
            if (dataResult.length < 1) return this.error(null, "something error!")
            return this.success(dataResult)
        } catch (err) {
            return this.error(null, err.message)
        }
    }

    async search() {
        const { request } = this
        const { query } = request.params

        try {
            const dataResult = []
            // check if has pageNumber or not
            // check if genres has parameter
            const url = `${baseUrl2}/cari/?post_type=manga&s=${query.replace(/ /g, '+')}`
            const { data } = await axios.get(url)
            const selector = cheerio.load(data)
            const root = selector('.perapih > section > .daftar > .bge')

            root.each((index, elm) => {
                const title = selector(elm).find('.kan > a > h3').text().trim()
                const thumb = selector(elm).find('.bgei > a > img').attr('src')
                const type = selector(elm).find('.bgei > a > div > b').text()
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
                obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${thumb}`
                obj.type = type
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
}

module.exports = HomeController
