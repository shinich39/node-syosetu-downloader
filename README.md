# node-syosetu-downloader

narou, kakuyomu, alphapolis, hameln

## Getting Started

### Installation

- npm

```console
npm install github:shinich39/node-syosetu-downloader
```

### Usage

- node

```js
import {
  parseURL,
  createURL,
  getMetadata,
  getChapter,
  getBook,
  close
} from "node-syosetu-downloader";

const metadata = await getMetadata(
  "narou",
  "n6868jy",
);

console.log(metadata);
// {
//   onGoing: boolean;
//   title: string;
//   author: string;
//   outline: string;
//   chapterIds: string[];
//   createdAt: number;
//   updatedAt: number;
// }

const chapter = await getChapter(
  "narou",
  "n6868jy",
  "1",
);

console.log(chapter);
// {
//   id: string,
//   title: string,
//   content: string,
// }

const book = await getBook(
  "narou",
  "n6868jy",
  (err, chapter, index, length) => {
    if (err) {
      console.error(err);
    } else {
      console.log(chapter);
      // {
      //   id: string,
      //   seq: number,
      //   title: string,
      //   content: string,
      // }
    }
  }
);

console.log(book);
// {
//   onGoing: boolean;
//   title: string;
//   author: string;
//   outline: string;
//   chapters: [
//     {
//       id: string,
//       title: string,
//       content: string,
//     }
//   ];
//   createdAt: number;
//   updatedAt: number;
// }

// destroy headless browser
await close();
```

## Acknowledgements

- [hameln-downloader2](https://github.com/minouejapan/hameln-downloader2)
- [kakuyomu-downloader-py](https://github.com/minouejapan/kakuyomu-downloader-py)
- [narou-downloader](https://github.com/minouejapan/narou-downloader)
- [alphapolis-downloader2](https://github.com/minouejapan/alphapolis-downloader2)