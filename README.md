# public-api-search

This is a web page which loads the README file from [Public APIs](https://github.com/public-apis/public-apis/blob/master/README.md) and renders a table listing the APIs which may be filtered and searched using some simple controls.

You can visit the live page at https://median-man.github.io/public-api-search/.

![app screen shot](./images/screen-shot.PNG)

## Usage

Use the toggle buttons for `CORS` and `HTTPS` to filter out APIs that are not reported to support these features to easily find APIs that will support client side AJAX requests.

You can filter the displayed results based on query by entering a search term in the input box.

## Bugs/Suggestions

Please feel free to open an issue if you have suggestions or wish to report a bug. Keep in mind that the data for the APIs is sourced from a third party project. If the data about an API is incorrect, head over to [Public APIs](https://github.com/public-apis/public-apis). All data for this page is sourced from the README.md file.

## Why did I use the README.md file instead of the REST API provided by Public APIs?

The REST API found [here](https://api.publicapis.org/) does not support cors which means I would have to create a backend and I'm just too lazy for that. If https://api.publicapis.org/ fixes support for CORS then I might update this project to use the REST Api instead of loading and parsing the README.md file.
