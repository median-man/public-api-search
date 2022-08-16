/** NOT FOR PRODUCTION USE. This module is used to serve a local development
 * build of the client app. */

import * as http from "http";
import * as serveStatic from "serve-static";
import * as path from "path";

const port = 3000;

export async function start() {
  try {
    // get homepage from package.json file to get the url that gets injected
    // into the production build.
    const { homepage } = await import(process.env.npm_package_json || "");
    const homepagePath = new URL(homepage || "").pathname;
    
    // create middleware for serving static files in build
    const serveDist = serveStatic(path.join(__dirname, "../../build"), {
      index: ["index.html"],
    });

    const handleRequest: http.RequestListener = (req, res) => {
      // redirect root path requests to the homepage path from package.json file
      if (!req.url || req.url === "/") {
        res.writeHead(302, {
          Location: homepagePath,
        });
        res.end();
        return;
      }

      // any requests that don't begin with the path in the homepage url from
      // package.json are invalid.
      if (!req.url.startsWith(homepagePath)) {
        res.writeHead(404);
        res.end(`Invalid path '${req.url}'`);
        return;
      }

      // remove the homepage from req.url before passing it to static file
      // middleware
      req.url = req.url.replace(homepagePath, "") || "/";
      serveDist(req, res, () => {
        // handle paths not found ind dist (This is a nearly impossible
        // scenario, but just in case...)
        if (!res.headersSent) {
          res.writeHead(404);
          return;
        }
        console.log(
          `Something unexpected went wrong with request. url: ${homepagePath}${req.url}`
        );
        res.end(`Invalid path ${req.url}`);
      });
    };

    // start the server
    const server = http.createServer(handleRequest);
    server.listen(port, "localhost", () =>
      console.log(`server listening at http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
}

start();
