const FS = require("fs")
const Path = require("path")
const ReadLine = require("readline")

main().catch(error)

function formatOutput(item) {
    console.log(item.name)
    console.log("Type: " + item.type)
    console.log("ID: " + item.id)
    console.log("Version: " + item.version)
    console.log("Home Page: " + item.homepageURL)
    console.log("Source: " + item.sourceURI)
    console.log()
}

async function main() {
    const args = process.argv.splice(2)
    const program = await getProgram(args)
    const profile = await getProfile(args, program)
    listAddons(profile)
}

async function getProgram(args) {
    const options = ["firefox", "thunderbird"]
    if (args.length > 0) {
        return validateParameter(args[0].toLowerCase(), options)
    }
    return await getOption(options)
}

async function getProfile(args, program) {
    const profilesFolder = getProfilesFolder(program)
    const options = FS.readdirSync(profilesFolder)
    if (options.length === 0) {
        error("No profiles found: " + profilesFolder)
    }
    const profile = args.length > 1 
        ? validateParameter(args[1], options) 
        : await getOption(options)
    return Path.join(profilesFolder, profile)
}

function validateParameter(parameter, options) {
    if (!options.includes(parameter)) {
        error("Invalid parameter: " + parameter)
    }
    return parameter
}

async function getOption(options) {
    return new Promise(resolve => {
        if (options.length === 1) {
            return resolve(options[0])
        }
        let index = 0
        options.forEach(profile => {
            index++
            console.log(`${index}. ${profile}`)
        })
        index++
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
                resolve(options[value - 1])
            }
        })
    })
}

function tryParseInt(str) {
    const parsed = parseInt(str, 10)
    if (isNaN(parsed)) { return null }
    return parsed;
}

function getProfilesFolder(program) {
    let path = null
    if (process.platform === "win32") {
        if (program === "thunderbird") {
            path = Path.join(process.env.APPDATA, "Thunderbird/Profiles")
        }
        else if (program === "firefox") {
            path = Path.join(process.env.APPDATA, "Mozilla/Firefox/Profiles")    
        }
    }
    else if (process.platform === "linux") {
        if (program === "thunderbird") {
            path = Path.join(process.env.HOME, ".thunderbird")
        }
        else if (program === "firefox") {
            path = Path.join(process.env.HOME, ".mozilla/firefox")
        }
    }
    else if (process.platform === "darwin") {
        if (program === "thunderbird") {
            path = Path.join(process.env.HOME, "Library/Thunderbird/Profiles")
        }
        else if (program === "firefox") {
            path = Path.join(process.env.HOME, "Library/Application Support/Firefox/Profiles")
        }
    }
    if (path === null) {
        error("OS not supported: " + process.platform);
    }
    if (!FS.existsSync(path)) {
        error("Profiles folder not found: " + path)
    }
    return path
}

function listAddons(profile) {
    const addonsFile = Path.join(profile, "addons.json")
    if (!FS.existsSync(addonsFile)) {
        error("Add-ons file not found: " + addonsFile)
    }
    const data = JSON.parse(FS.readFileSync(addonsFile, 'utf8'))
    for (const item of data.addons) {
        formatOutput(item)
    }
}

function error(message) {
    console.error(message)
    process.exit(1)
}