# Tab Rename

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A clean, minimal Chrome extension for renaming browser tabs with ease.

## Features

- **Tab Listing** - Shows all open tabs in the current window with their favicons
- **Inline Editing** - Click any tab title to edit it directly
- **Persistent Storage** - Custom titles are saved and persist across browser sessions
- **Reset Individual** - Reset any tab back to its original title
- **Reset All** - One-click button to reset all custom titles
- **Keyboard Shortcut** - Press `Alt+R` (Windows/Linux) or `MacCtrl+R` (Mac) to open the popup
- **Auto Cleanup** - Automatically removes old entries after 24 hours
- **Toast Notifications** - Visual feedback for all actions
- **Smart Error Handling** - Gracefully handles protected pages and closed tabs
- **Hover Tooltips** - Hover over any tab title to see the original title

## Installation

### Manual Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `tabrename` directory

## Usage

1. Click the extension icon or press `Alt+R` / `MacCtrl+R` to open the popup
2. Click on any tab title to edit it
3. Type your new title and press `Enter` or click the checkmark to apply
4. Press `Escape` to cancel editing
5. Hover over any tab title to see the original title
6. To reset a tab, click the reset icon (circular arrow)
7. To reset all tabs, click "Reset All" in the header

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt+R` / `MacCtrl+R` | Open extension popup |
| `Enter` | Apply edited title |
| `Escape` | Cancel editing |

## Permissions

- **tabs** - To list and access tab information
- **scripting** - To execute scripts on tabs to modify titles
- **storage** - To persist custom titles across sessions

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Repository

https://github.com/RyadMM/tabRename

## Version

2.3.0
