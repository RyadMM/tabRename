# Tab Rename

A clean, minimal Chrome extension for renaming browser tabs with ease.

## Features

- **Inline Editing** - Click any tab title to edit it directly
- **Persistent Storage** - Custom titles are saved and persist across browser sessions
- **Reset Individual** - Reset any tab back to its original title
- **Reset All** - One-click button to reset all custom titles
- **Keyboard Shortcut** - Press `Alt+R` (Windows/Linux) or `MacCtrl+R` (Mac) to open the popup
- **Auto Cleanup** - Automatically removes old entries after 24 hours

## Installation

### Manual Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `tabrename` directory

## Usage

1. Click the extension icon or press `Alt+R` / `MacCtrl+R`
2. Click on any tab title to edit it
3. Type your new title and press Enter or click the checkmark
4. To reset a tab, click the reset icon (circular arrow)
5. To reset all tabs, click "Reset All" in the header

## Permissions

- **tabs** - To list and access tab information
- **scripting** - To execute scripts on tabs to modify titles
- **storage** - To persist custom titles across sessions

## Version

2.3.0
