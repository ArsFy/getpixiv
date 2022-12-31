const axios = require("axios");
const fs = require("fs");
const path = require("path")

let setting = {
    init: false,
    headers: {},
}

const init = (cookies, headers) => {
    if (cookies !== '') {
        if (headers !== undefined) {
            setting = {
                init: true,
                headers: {
                    cookie: cookies,
                    ...headers
                },
            }
        } else {
            setting = {
                init: true,
                headers: {
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'zh-TW,zh-HK;q=0.9,zh-CN;q=0.8,zh;q=0.7,en-GB;q=0.6,en;q=0.5,en-US;q=0.4',
                    'cookie': cookies
                },
            }
        }
    } else {
        console.error("GetPixiv:", "cookies cannot be empty")
    }
}

const get = (id, pathname, filename) => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://www.pixiv.net/artworks/' + id,
            headers: setting.headers
        }).then(async (res) => {
            const info = JSON.parse(res.data
                .match(/\<meta name="preload-data" id="meta-preload-data" content='(.*)'\>/g)[0]
                .replace(/<meta name="preload-data" id="meta-preload-data" content='|'>/g, ''));

            const fileext = info.illust[id].urls.original.split('.');
            return axios({
                headers: {
                    referer: 'https://www.pixiv.net/',
                    ...setting.headers
                },
                url: info.illust[id].urls.original,
                responseType: 'stream',
            }).then((response) => {
                const file = path.join(pathname, filename + '.' + fileext[fileext.length - 1]);
                response.data.pipe(fs.createWriteStream(file));
                resolve(file);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    })
}

module.exports = {
    init,
    get
}