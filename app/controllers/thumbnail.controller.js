const download = require('image-downloader')
const Controller = require('cores/Controller')

class ThumbnailController extends Controller {
  async show(){
    const { request } = this
    try {
      const urlImage = request.query.url
      
      let options = {
          url: urlImage,
          dest: '../../public/images/'
        }
      await download.image(options)
      .then(({ filename }) => {
        console.log("[!] "+filename);
        return this.raw(filename)
      })
      .catch((err) => console.error(err))
    } catch (err) {
      return this.error(null, err.message)
    }
  }
}

module.exports = ThumbnailController