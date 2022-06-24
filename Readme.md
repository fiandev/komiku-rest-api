# Komiku Scrapper

```bash
URL > https://komiku.id/
```

## Build with

-   Node Js
-   Cheerio
-   Axios
-   Express

## Installation

-   Clone this repo
-   Install all dependencies
    ```bash
    > npm i
    ```
-   Run
    ```bash
    > npm start
    ```
-   Server will be run at `127.0.0.1:4000/localhost:4000`

## Route

-   Home

    -   /latest
    -   /popular
    -   /search/:query

-   Manga

    -   /manga/popular
    -   /manga/latest
    -   /manga/page/:pageNumber

-   Manhua

    -   /manhua/popular
    -   /manhua/latest
    -   /manhua/page/:pageNumber

-   Manhwa

    -   /manhwa/popular
    -   /manhwa/latest
    -   /manhwa/page/:pageNumber

-   Genre

    -   /genre
    -   /genre/:genreEndpoint
    -   /genre/:genreEndpoint/page/:pageNumber

-   Detail
    -   /detail/:slug
    -   /chapter/:slug

-   Raw Image
    -   /thumbnail/?url={image url}
