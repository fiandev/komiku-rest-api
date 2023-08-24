const axios = require('axios')
const cheerio = require('cheerio')
const Controller = require('../../core/Controller')
const { baseUrl2 } = require('../constants/url')
const { genres } = require('constants/genres')
const { chapterTrim, mangaTrim, cleanUrl } = require('../helpers/formatter')

class GenreController extends Controller {
    async genreDetail() {
        const { request } = this
        const { genreEndpoint } = request.params
        let { pageNumber } = request.params

        try {
            const dataResult = []
            // check if has pageNumber or not
            pageNumber = pageNumber || '1'
            // check if genres has parameter
            const url = (pageNumber === '1')
                ? `${baseUrl2}/pustaka/?orderby=modified&genre=${genreEndpoint}&genre2=&status=&category_name=`
                : `${baseUrl2}/pustaka/page/${pageNumber}/?orderby=modified&genre=${genreEndpoint}&genre2&status&category_name`
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

    genre() {
        try {
            const dataResult = []
            genres.forEach((value) => {
                const obj = {}
                obj.genre = value
                obj.genre_endpoint = value.toLowerCase().replace(/ /g, '-')
                dataResult.push(obj)
            })

            return this.success(dataResult)
        } catch (err) {
            return this.error(null, err.message)
        }
    }
}

module.exports = GenreController
