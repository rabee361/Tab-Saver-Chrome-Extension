// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { // sender is the tab that sent the message
  if (request.action === "getSavedTabs") {
    // Get saved tabs from storage and send back to content script
    chrome.storage.local.get(['savedTabs'], function(result) {
      sendResponse({savedTabs: result.savedTabs || []});
    });
    return true; // Required to use sendResponse asynchronously
  } 
  else if (request.action === "openTab") {
    // Open a new tab with the specified URL
    chrome.tabs.create({url: request.url});
    return true;
  }
});
