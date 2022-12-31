import axios, { AxiosResponse } from "axios";
import fs from "fs";
import path from "path";

let setting = {
    init: false,
    headers: {},
}

const init = (cookies: string, headers: JSON | undefined) => {
    if (cookie !== '') {
        if (headers !== undefined) {
            setting = {
                init: true,
                headers: {
                    cookies,
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
                    'cookie': cookie
                },
            }
        }
    } else {
        console.error("GetPixiv:", "cookies cannot be empty")
    }
}

const cookie: string = String(fs.readFileSync("./cookie"));

const get = (id: string, pathname: string, filename: string) => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://www.pixiv.net/artworks/' + id,
            headers: setting.headers
        }).then(async (res: AxiosResponse) => {
            const info = JSON.parse(res.data
                .match(/\<meta name="preload-data" id="meta-preload-data" content='(.*)'\>/g)[0]
                .replace(/<meta name="preload-data" id="meta-preload-data" content='|'>/g, ''));

            const fileext: string[] = info.illust[id].urls.original.split('.');
            return axios({
                headers: {
                    referer: 'https://www.pixiv.net/',
                    ...setting.headers
                },
                url: info.illust[id].urls.original,
                responseType: 'stream',
            }).then((response: AxiosResponse) => {
                const file: string = path.join(pathname, filename + '.' + fileext[fileext.length - 1]);
                response.data.pipe(fs.createWriteStream(file));
                resolve(file);
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    })
}

export {
    init,
    get
}