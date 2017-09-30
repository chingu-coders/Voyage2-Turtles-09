# Momentum Health - Getting Started

## Files

Every extension has the following files:

+ A manifest file (manifest.json)
+ One or more HTML files (unless the extension is a theme)
+ Optional: One or more JavaScript files
+ Optional: Any other files your extension needs—for example, image files

## The manifest.json file

**Required manifest entries**

```javascript
  "manifest_version": 2,  
  "name": "My Extension",  
  "version": "versionString"
```

**To replace the default Chrome Tab with the Momentum Health tab page**

```javascript
  "chrome_url_overrides": {  
    "newtab": "index.html"  
  }
```

## Loading the extension from your local files
+ Visit chrome://extensions in your browser (or open up the Chrome menu by clicking the icon to the far right of the Omnibox, and select _Extensions_ under the _More tools_ menu to get to the same place).
+ Ensure that the Developer mode checkbox in the top right-hand corner is checked.
+ Click _Load unpacked extension_, to pop up a file-selection dialog.
+ Navigate to the directory in which your extension files live, and select it.
+ Alternatively, you can drag and drop the directory where your extension files live onto chrome://extensions in your browser to load it.
