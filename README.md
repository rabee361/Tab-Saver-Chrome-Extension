

# Tab Saver Extension

A Chrome extension that allows you to save and manage your browser tabs.

## Features

- Save the current tab with a single click
- View all saved tabs in a sidebar
- Open saved tabs by clicking on them
- Remove tabs from your saved collection
- Displays tab favicons for easy recognition

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The Tab Saver Extension icon should now appear in your browser toolbar

## Usage

1. Click the extension icon in your toolbar to open the popup
2. Click "Save Tab" to save the current tab
3. Click "Remove Tab" to remove the current tab from your saved collection
4. Click on any saved tab in the sidebar to open it in a new tab

## File Structure

```
tab-saver-extension/
├── css/
│   └── main.css
├── images/
│   ├── main-16.png
│   ├── main-24.png
│   ├── main-32.png
│   └── main-128.png
├── scripts/
│   ├── content.js
│   └── main.js
├── main.html
├── manifest.json
└── README.md
```

## Permissions

This extension requires the following permissions:
- `tabs`: To access and manage browser tabs
- `storage`: To save your tabs locally

## Development

To modify this extension:
1. Make changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Click the extension icon to test your changes
