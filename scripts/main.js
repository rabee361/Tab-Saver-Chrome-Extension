document.addEventListener('DOMContentLoaded', function() {
  // Load saved tabs when popup opens
  loadSavedTabs();
  
  // Add event listeners to buttons
  document.getElementById('saveTab').addEventListener('click', saveCurrentTab);
  document.getElementById('removeTab').addEventListener('click', removeSelectedTab);
});

// Save current tab
async function saveCurrentTab() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  const currentTab = tabs[0];
  
  // Get existing saved tabs
  chrome.storage.local.get(['savedTabs'], function(result) {
    const savedTabs = result.savedTabs || [];
    
    // Check if tab is already saved
    if (!savedTabs.some(tab => tab.url === currentTab.url)) {
      // Add current tab to saved tabs
      savedTabs.push({
        id: Date.now(), // Use timestamp as unique ID
        title: currentTab.title,
        url: currentTab.url,
        favicon: `https://s2.googleusercontent.com/s2/favicons?domain=${new URL(currentTab.url).hostname}`
      });
      
      // Save updated list
      chrome.storage.local.set({savedTabs: savedTabs}, function() {
        loadSavedTabs(); // Refresh the display
      });
    }
  });
}

// Load and display saved tabs
function loadSavedTabs() {
  const savedTabsContainer = document.getElementById('savedTabs');
  savedTabsContainer.innerHTML = ''; // Clear container
  
  chrome.storage.local.get(['savedTabs'], function(result) {
    const savedTabs = result.savedTabs || [];
    
    if (savedTabs.length === 0) {
      savedTabsContainer.innerHTML = '<p>No saved tabs</p>';
      return;
    }
    
    // Create a tag element for each saved tab
    savedTabs.forEach(tab => {
      const tabElement = document.createElement('div');
      tabElement.className = 'tab-tag';
      tabElement.dataset.id = tab.id;
      tabElement.dataset.url = tab.url;

      // Add favicon
      const favicon = document.createElement('img');
      favicon.src = tab.favicon;
      tabElement.appendChild(favicon);

      // Add title
      const title = document.createElement('span');
      title.className = 'tab-tag-title';
      title.textContent = tab.title;
      tabElement.appendChild(title);

      // Add a remove btn
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-tag';
      removeBtn.innerHTML = '<i class="fi fi-rr-trash"></i>';
      removeBtn.addEventListener('click', function() {
        removeTab(tab.id);
      });
      tabElement.appendChild(removeBtn);

      // Add click event to open the tab
      tabElement.addEventListener('click', function() {
        chrome.tabs.create({url: tab.url});
      });
      
      savedTabsContainer.appendChild(tabElement);
    });
  });
}

// Remove selected tab
function removeSelectedTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    
    chrome.storage.local.get(['savedTabs'], function(result) {
      let savedTabs = result.savedTabs || [];
      
      // Filter out the current URL
      savedTabs = savedTabs.filter(tab => tab.url !== currentUrl);
      
      // Save updated list
      chrome.storage.local.set({savedTabs: savedTabs}, function() {
        loadSavedTabs(); // Refresh the display
      });
    });
  });
}



function removeTab(id) {
  chrome.storage.local.get(['savedTabs'], function(result) {
    let savedTabs = result.savedTabs || [];
    
    // Filter out the tab with the specified ID
    savedTabs = savedTabs.filter(tab => tab.id !== id);
    
    // Save updated list
    chrome.storage.local.set({savedTabs: savedTabs}, function() {
      loadSavedTabs(); // Refresh the display
    });
  });
}