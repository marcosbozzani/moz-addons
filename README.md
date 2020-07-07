# moz-addons

List installed add-ons for a Thunderbird or Firefox profile

## Requirements

- Node.js
- Firefox or Thunderbird
- Supported OS: Windows, Linux, MacOS

## Usage

1. Download [moz-addons.js](https://raw.githubusercontent.com/marcosbozzani/moz-addons/master/moz-addons.js)
2. Run `node moz-addons {program} {profile}`:
   - `{program}`: `thunderbird` or `firefox` (optional)
   - `{profile}`: `xxxxxxxx.default` (optional)

## Custom output

1. Open `moz-addons` with a text editor
2. Edit the `formatOutput` function. The default is:

```javascript
function formatOutput(item) {
    console.log(" - " + item.name)
    console.log("Type: " + item.type)
    console.log("ID: " + item.id)
    console.log("Version: " + item.version)
    console.log("Home Page: " + item.homepageURL)
    console.log("Source: " + item.sourceURI)
    console.log()
}
```
