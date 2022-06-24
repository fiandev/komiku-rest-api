const log = (req) => {
    const userAgent = req.device.type
    const time = new Date().toLocaleString()
    console.log(`[${userAgent} @${time}] => ${req.originalUrl}`)
}

module.exports = { log }
