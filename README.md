# Get Pixiv

```
npm i getpixiv
```

-----

```javascript
const getpixiv = require('getpixiv');
const fs = require('fs');

getpixiv.init(fs.readFileSync('./cookie'));

getpixiv.init(
    '1919810',     // Pixiv ID
    './downloads/', // Downloads Path
    'filename'      // Filename (only name, does not contain ext)
).then(name=>{
    console.log(name) // filepath + filename + ext
})
```