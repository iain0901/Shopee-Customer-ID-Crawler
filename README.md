# Shopee Buyer ID Extractor

A Chrome extension that automatically extracts buyer IDs from Shopee seller center order pages.

## Features

- **Automatic ID Extraction**: Automatically extracts buyer usernames from order pages
- **Auto-Pagination**: Automatically navigates through all pages to collect IDs
- **Progress Tracking**: Real-time progress display showing:
  - Current page number
  - Number of IDs collected per page
  - Total IDs collected
  - Unique IDs count
  - Duplicate count
  - Duplication rate
- **Data Management**:
  - Copy all IDs to clipboard
  - Download IDs as text file
  - Remove duplicate IDs
  - Restore IDs to state before duplicate removal
- **Data Persistence**: All collected IDs are saved in browser storage and persist between sessions

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to your Shopee Seller Center order page
2. Click the extension icon in Chrome toolbar
3. Click "開始提取ID" (Start Extraction) to begin collecting IDs
4. The extension will:
   - Add two test IDs ("3dstu_test") for verification
   - Automatically navigate through all pages
   - Extract buyer IDs from each page
   - Wait 5 seconds between page transitions
   - Display real-time progress and statistics

### Available Actions

- **Copy IDs**: Click "複製全部ID" to copy all IDs to clipboard
- **Download IDs**: Click "下載ID清單" to save IDs as a text file
- **Remove Duplicates**: Click "刪除重複ID" to remove duplicate IDs
- **Restore**: Click "復原刪除重複" to restore IDs to their state before duplicate removal

## Technical Details

### Files Structure

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface
- `popup.js`: Popup logic and user interactions
- `content.js`: Page scraping and navigation logic

### Permissions Required

- `activeTab`: For accessing the current tab
- `scripting`: For executing scripts
- `tabs`: For tab manipulation
- Host permission for `*://*.shopee.tw/*`

### Data Storage

- Uses Chrome's `localStorage` for data persistence
- Stores both current and original (pre-duplicate removal) ID lists

### Error Handling

- Waits for elements to load before extraction
- Gracefully handles pagination end
- Maintains data integrity during duplicate removal and restoration

## Limitations

- Works only on Shopee Taiwan seller center pages
- Maximum storage capacity limited by Chrome's localStorage limits
- Requires manual start for each extraction session

## Testing

The extension includes two identical test IDs ("3dstu_test") that are added at the start of each extraction. These can be used to verify:
- The duplicate detection functionality
- The duplicate removal feature
- The restore functionality

## Support

For issues or feature requests, please contact the developer or submit an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 