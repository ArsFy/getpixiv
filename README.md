# Get Pixiv

```
npm i downloadpixiv
```

-----

```javascript
const dp = require('downloadpixiv');

dp.init('PHPSESSID=114514_sedghuashgiuesaghieg;');

dp.get(
    '1919810',     // Pixiv ID
    './downloads/', // Downloads Path
    'filename'      // Filename (only name, does not contain ext)
).then(name=>{
    console.log(name) // filepath + filename + ext
})
```