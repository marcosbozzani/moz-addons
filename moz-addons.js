const FS = require("fs")
const Path = require("path")
const ReadLine = require("readline")

function formatOutput(item) {
    console.log(item.name, item.id, item.version)
    console.log("Home Page: " + item.homepageURL)
    console.log("Source: " + item.sourceURI)
    console.log("Type: " + item.type)
    console.log()
}

const args = process.argv.splice(2)
const profilesFolder = getProfilesFolder()
if (args.length > 0) {
    listAddons(profilesFolder, args[0])
}
else {
    listProfiles(profilesFolder)
}

function listProfiles(profilesFolder) {
    if (!FS.existsSync(profilesFolder)) {
        error("Profiles folder not found: " + profilesFolder)
    }
    const options = FS.readdirSync(profilesFolder)
    if (options.length === 0) {
        error("No profiles found: " + profilesFolder)
    }
    getOption(options, profile => listAddons(profilesFolder, profile))
}

function listAddons(profilesFolder, profile) {
    console.log(profilesFolder, profile, "addons.json")
    const addonsFile = Path.join(profilesFolder, profile, "addons.json")
    if (!FS.existsSync(addonsFile)) {
        error("Add-ons file not found: " + addonsFile)
    }
    const data = JSON.parse(FS.readFileSync(addonsFile, 'utf8'))
    for (const item of data.addons) {
        formatOutput(item)
    }
}

function getOption(options, result) {
    let index = 0
    options.forEach(profile => {
        index++
        console.log(`${index}. ${profile}`)
    })
    console.log(`${index}. (exit)`)
    const reader = ReadLine.createInterface(process.stdin, process.stdout);
    reader.setPrompt("Choose a profile: ")
    reader.prompt()
    reader.on("line", line => {
        const value = tryParseInt(line)
        if (value === null || value <= 0 || value > index) {
            reader.prompt()    
        }
        else {
            reader.close()
            if (value === index) {
                process.exit(0)
            }
            result(options[value - 1])
        }
    })
}

function tryParseInt(str) {
    const parsed = parseInt(str, 10)
    if (isNaN(parsed)) { return null }
    return parsed;
}

function getProfilesFolder() {
    if (process.platform === "win32") {
        return Path.join(process.env.APPDATA, "Mozilla/Firefox/Profiles")
    }
    if (process.platform === "linux") {
        return Path.join(process.env.HOME, ".mozilla/firefox")
    }
    if (process.platform === "darwin") {
        return Path.join(process.env.HOME, "Library/Application Support/Firefox/Profiles")
    }
    error("OS not supported: " + process.platform);
}

function error(message) {
    console.error(message)
    process.exit(1)
}