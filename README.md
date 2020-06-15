# moz-addons

List installed add-ons for a Thunderbird or Firefox profile

## Requirements

- Node.js
- Firefox or Thunderbird
- Supported OS: Windows, Linux, MacOS

## Usage

1. Download [moz-addons.js](moz-addons.js)
2. Run `node moz-addons` or `node moz-addons {profile}`

## Custom output

1. Open `moz-addons` with a text editor
2. Edit the `formatOutput` function. The default is:

```javascript
function formatOutput(item) {
    console.log(item.name, item.id, item.version)
    console.log("Home Page: " + item.homepageURL)
    console.log("Source: " + item.sourceURI)
    console.log("Type: " + item.type)
    console.log()
}
```