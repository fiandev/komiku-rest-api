const axios = require('axios')
const cheerio = require('cheerio')
const Controller = require('../../core/Controller')
const { detailUrl, chapterUrl } = require('../constants/url')
const { chapterTrim, cleanUrl } = require('../helpers/formatter')

class DetailController extends Controller {
    async detail() {
        try {
            const { request } = this
            const { slug } = request.params
            const { data } = await axios.get(`${detailUrl}/${slug}/`)
            const selector = cheerio.load(data)
            const root = selector('.series > .perapih > article')

            const obj = {}
            const title = root.find('#Judul > h1').text().trim()
            const thumb = root.find('#Informasi > .ims > img').attr('@')

            // info
            const objInfo = {}
            root.find('table.inftable > tbody > tr').each((index, elm) => {
                if (index === 0) objInfo.title_id = selector(elm).children('td').last().text()
                if (index === 1) objInfo.type = selector(elm).children('td').last().text()
                if (index === 3) objInfo.writer = selector(elm).children('td').last().text()
                if (index === 4) objInfo.status = selector(elm).children('td').last().text()
                if (index === 6) objInfo.reader = selector(elm).children('td').last().text()
                if (index === 7) objInfo.read_direction = selector(elm).children('td').last().text()
            })

            // genre
            root.find('#Informasi > .genre > li').each((index, elm) => {
                if (objInfo.genre) {
                    objInfo.genre += `, ${selector(elm).text()}`
                } else {
                    objInfo.genre = selector(elm).text()
                }
            })

            // summary and synopsis
            const summary = []
            root.find('#Sinopsis > h3').nextUntil('h2').each((index, elm) => {
                summary.push(selector(elm).text().trim())
            })
            const synopsis = root.find('#Sinopsis > h2').nextUntil('section').text().trim()

            // chapter
            const chapters = []
            root.find('#Chapter > table > tbody > tr').each((index, elm) => {
                const objChapter = {}
                if (index !== 0) {
                    objChapter.chapter = selector(elm).children('td').first().text()
                        .trim()
                    objChapter.chapter_endpoint = selector(elm).children('td').first()
                        .children('a')
                        .attr('href')
                    objChapter.chapter_endpoint = chapterTrim(objChapter.chapter_endpoint)
                    objChapter.date = selector(elm).children('td').last().text()
                        .trim()

                    chapters.push(objChapter)
                }
            })

            obj.title = title
            obj.title_id = objInfo.title_id
            obj.thumb = `${this.getBaseUrl()}/thumbnail/?url=${cleanUrl(thumb)}`
            obj.type = objInfo.type
            obj.writer = objInfo.writer
            obj.status = objInfo.status
            obj.reader = objInfo.reader
            obj.read_direction = objInfo.read_direction
            obj.genre = objInfo.genre
            obj.summary = summary
            obj.synopsis = synopsis
            obj.chapters = chapters
            if (obj.title == "" || obj.title == null) return this.error(null, "not found!")
            return this.success(obj)
        } catch (err) {
            return this.error(null, err.message)
        }
    }

    async chapter() {
        try {
            const { request } = this
            const { slug } = request.params
            const { data } = await axios.get(`${chapterUrl}/${slug}/`)
            const selector = cheerio.load(data)
            const root = selector('.content')

            const obj = {}
            const title = root.find('#Judul > h1').first().text().trim()
            const chapter = selector('.nxpr > span').text()

            // prev and next chapter
            let prevChapterEndpoint = ''
            let nextChapterEndpoint = ''
            selector('.nxpr > a').each((index, elm) => {
                if (selector(elm).children('svg').attr('data-icon') === 'caret-right') {
                    nextChapterEndpoint = selector(elm).attr('href')
                }
                if (selector(elm).children('svg').attr('data-icon') === 'caret-left') {
                    prevChapterEndpoint = selector(elm).attr('href')
                }
            })

            const images = []
            root.find('#Baca_Komik > img').each((index, elm) => {
                const objImage = {}
                objImage.alt = selector(elm).attr('alt')
                objImage.image = `${this.getBaseUrl()}/thumbnail/?url=${cleanUrl(selector(elm).attr('@'))}`
                images.push(objImage)
            })

            obj.title = title
            obj.chapter = chapter
            obj.prev_chapter_endpoint = chapterTrim(prevChapterEndpoint)
            obj.next_chapter_endpoint = chapterTrim(nextChapterEndpoint)
            obj.images = images
            if (obj.title == "" || obj.title == null) return this.error(null, "chapter not found!")
            return this.success(obj)
        } catch (err) {
            return this.error(null, err.message)
        }
    }
}

module.exports = DetailController
