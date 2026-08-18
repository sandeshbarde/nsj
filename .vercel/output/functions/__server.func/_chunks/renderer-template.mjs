import { r as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
var rendererTemplate = () => new HTTPResponse("<!doctype html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n\r\n    <meta\r\n      name=\"viewport\"\r\n      content=\"width=device-width, initial-scale=1.0\"\r\n    />\r\n\r\n    <meta name=\"theme-color\" content=\"#111111\" />\r\n\r\n    <meta\r\n      name=\"description\"\r\n      content=\"NSJ Jewellery — Discover timeless jewellery crafted with elegance and precision.\"\r\n    />\r\n\r\n    <meta\r\n      name=\"keywords\"\r\n      content=\"NSJ Jewellery, jewellery, rings, earrings, necklaces, bracelets, bangles, silver jewellery\"\r\n    />\r\n\r\n    <meta name=\"author\" content=\"NSJ Jewellery\" />\r\n\r\n    <!-- Open Graph -->\r\n    <meta property=\"og:title\" content=\"NSJ Jewellery\" />\r\n    <meta\r\n      property=\"og:description\"\r\n      content=\"Discover timeless jewellery crafted with elegance and precision.\"\r\n    />\r\n    <meta property=\"og:type\" content=\"website\" />\r\n\r\n    <!-- Favicon -->\r\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\r\n\r\n    <!-- Optional fallback favicon -->\r\n    <link rel=\"shortcut icon\" href=\"/favicon.svg\" />\r\n\r\n    <title>NSJ Jewellery</title>\r\n  </head>\r\n\r\n  <body>\r\n    <!-- React Root -->\r\n    <div id=\"root\"></div>\r\n\r\n    <!-- React Entry -->\r\n    <script type=\"module\" src=\"/src/main.tsx\"><\/script>\r\n  </body>\r\n</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };
