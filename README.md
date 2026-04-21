# PurePage

A Chrome extension that strips any web page down to a clean, distraction-free reading view in one click.

Built for anyone who wants to read without ads, sidebars, cookie banners, and other noise.

## Features

- **One-click reader view** - extracts the main article content from any page
- **Three themes** - Light, Sepia, and Dark
- **Three font sizes** - Small, Medium, Large
- **Three font styles** - Sans-serif, Serif, and OpenDyslexic (for improved readability)
- **CE term highlighting** - optionally highlights circular economy terminology in the reader view (works alongside CEChecker)
- **Persistent settings** - theme, font, and size preferences are saved and restored between sessions
- **Full toolbar in reader view** - change settings without going back to the popup

## Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `purepage` folder

## How It Works

1. Click the PurePage icon on any article or content page
2. The extension injects Mozilla's Readability library into the page
3. Readability extracts the main article content, title, byline, and source
4. The extracted content is passed to a clean reader page hosted within the extension
5. Your settings are applied and the reader view opens in a new tab

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Grants temporary access to the current tab when the popup is opened |
| `scripting` | Injects the Readability library and extracts article content from the page |
| `storage` | Saves your theme, font, and size preferences locally |

## Third-Party Libraries

| Library | Licence | Source |
|---|---|---|
| [Readability.js](https://github.com/mozilla/readability) | Apache 2.0 | Mozilla |
| [OpenDyslexic](https://opendyslexic.org) | SIL Open Font Licence 1.1 | Abelardo Gonzalez |

## File Structure

```
purepage/
  manifest.json             Extension config and permissions
  popup.html                Extension popup UI and settings
  popup.js                  Popup logic - settings and article extraction trigger
  reader.html               Clean reader page template
  reader.js                 Reader logic - applies settings, renders content, CE highlighting
  reader.css                Reader styles - themes, fonts, layout
  lib/
    Readability.js          Mozilla's article extraction library (Apache 2.0)
    OpenDyslexic-Regular.woff2   OpenDyslexic font file (SIL OFL 1.1)
  icons/                    Extension icons (16px, 48px, 128px)
```

## Licence

MIT (extension code only - third-party libraries retain their own licences as noted above)
