const Express = require('express')
const GenreController = require('../app/controllers/Genre.controller')
const HomeController = require('../app/controllers/Home.controller')
const DetailController = require('../app/controllers/Detail.controller')
const MangaController = require('../app/controllers/Manga.controller')
const ManhuaController = require('../app/controllers/Manhua.controller')
const ManhwaController = require('../app/controllers/Manhwa.controller')
const ThumbnailController = require('../app/controllers/thumbnail.controller')
const { log } = require('../app/middleware/logging')

const router = Express.Router()
class Route {
    init() {
        return [
            this.get('/latest', (req, res, next) => new HomeController(req, res, next).latest()),
            this.get('/popular', (req, res, next) => new HomeController(req, res, next).popular()),
            this.get('/search/:query', (req, res, next) => new HomeController(req, res, next).search()),

            this.get('/manga/popular', (req, res, next) => new MangaController(req, res, next).popular()),
            this.get('/manga/latest', (req, res, next) => new MangaController(req, res, next).latest()),
            this.get('/manga/page/:pageNumber', (req, res, next) => new MangaController(req, res, next).all()),

            this.get('/manhua/popular', (req, res, next) => new ManhuaController(req, res, next).popular()),
            this.get('/manhua/latest', (req, res, next) => new ManhuaController(req, res, next).latest()),
            this.get('/manhua/page/:pageNumber', (req, res, next) => new ManhuaController(req, res, next).all()),

            this.get('/manhwa/popular', (req, res, next) => new ManhwaController(req, res, next).popular()),
            this.get('/manhwa/latest', (req, res, next) => new ManhwaController(req, res, next).latest()),
            this.get('/manhwa/page/:pageNumber', (req, res, next) => new ManhwaController(req, res, next).all()),

            this.get('/genre', (req, res, next) => new GenreController(req, res, next).genre()),
            this.get('/genre/:genreEndpoint', (req, res, next) => new GenreController(req, res, next).genreDetail()),
            this.get('/genre/:genreEndpoint/page/:pageNumber', (req, res, next) => new GenreController(req, res, next).genreDetail()),

            this.get('/detail/:slug', (req, res, next) => new DetailController(req, res, next).detail()),
            this.get('/chapter/:slug', (req, res, next) => new DetailController(req, res, next).chapter()),
            this.get('/thumbnail/', (req, res, next) => new ThumbnailController(req, res, next).show()),
        ]
    }

    // eslint-disable-next-line class-methods-use-this
    get(...args) {
        // add middleware log
        args.push(log)
        return router.get(...args)
    }
}

exports.Route = Route

/**
 * manga/
 * manhua/
 * manhwa/
 * ------------
 * manga/popular
 * manhwa/popular
 * manhua/popular
 * ------------
 * manga/page/:pageNumber
 * manhua/page/:pageNumber
 * manhwa/page/:pageNumber
 * ------------
 * search/:query
 * ------------
 * detail/:slug
 * ------------
 * chapter/:slug
 * ------------
 * genres
 * ------------
 * genres/:genreEndpoint/page/:pageNumber
 * ------------
 * latest
 * ------------
 * thumbnail/?url={image url}
 * ------------
 */
