document.addEventListener('DOMContentLoaded', function() {
  // Load saved tabs when popup opens
  loadSavedTabs();
  
  // Add event listeners to buttons
  document.getElementById('saveTab').addEventListener('click', saveCurrentTab);
  document.getElementById('removeTab').addEventListener('click', removeSelectedTab);
  document.getElementById('showOnScreen').addEventListener('click', showTabsOnScreen);
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


// Generic function to display tabs in a given container
function showTabsOnScreen(tabsArray, containerElement) {
  if (!containerElement) {
    console.error('showTabsOnScreen: containerElement is not provided or is null.');
    return;
  }
  containerElement.innerHTML = ''; // Clear container

  if (!tabsArray || tabsArray.length === 0) {
    const noTabsMessage = document.createElement('p');
    noTabsMessage.textContent = 'No tabs to display';
    containerElement.appendChild(noTabsMessage);
    return;
  }

  tabsArray.forEach(tab => {
    const tabElement = document.createElement('div');
    tabElement.className = 'tab-tag'; // Class for styling
    if (tab.id) { 
        tabElement.dataset.id = tab.id;
    }
    if (tab.url) {
        tabElement.dataset.url = tab.url;
    }

    // Add favicon if available
    if (tab.favicon) { 
        const faviconImage = document.createElement('img'); // Renamed to avoid conflict
        faviconImage.src = tab.favicon;
        faviconImage.alt = ''; // Alt text for accessibility
        faviconImage.style.width = '16px'; 
        faviconImage.style.height = '16px';
        faviconImage.style.marginRight = '8px';
        faviconImage.style.verticalAlign = 'middle'; // Align favicon nicely with text
        tabElement.appendChild(faviconImage);
    }

    // Add title (fallback to URL if title is missing)
    const titleSpan = document.createElement('span'); // Renamed to avoid conflict
    titleSpan.className = 'tab-tag-title'; // Class for styling
    titleSpan.textContent = tab.title || tab.url || 'Untitled Tab'; 
    tabElement.appendChild(titleSpan);

    // Add click event to open the tab, only if URL is present
    if (tab.url) {
        tabElement.addEventListener('click', function() {
            chrome.tabs.create({ url: tab.url });
        });
        tabElement.style.cursor = 'pointer'; // Indicate it's clickable
    }

    containerElement.appendChild(tabElement);
  });
}
