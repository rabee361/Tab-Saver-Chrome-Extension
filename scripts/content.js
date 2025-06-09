
// This script runs on web pages, not in the extension popup
// Display saved tabs as balls on the left side of any web page

// Wait for the page to be fully loaded
window.addEventListener('load', function() {
  // Create container for the balls
  const containerElement = document.createElement('div');
  containerElement.setAttribute('id', 'draggableTabContainer');
  containerElement.className = 'tab-saver-balls-container';
  document.body.appendChild(containerElement);
  
  // Get saved tabs from storage
  chrome.storage.local.get(['savedTabs'], function(result) {
    const tabsArray = result.savedTabs || [];
    
    if (!tabsArray || tabsArray.length === 0) {
      const noTabsMessage = document.createElement('p');
      noTabsMessage.textContent = 'No saved tabs';
      noTabsMessage.className = 'tab-saver-no-tabs';
      containerElement.appendChild(noTabsMessage);
      return;
    }

    // Create ball container
    const ballContainer = document.createElement('div');
    ballContainer.className = 'tab-saver-ball-container';
    containerElement.appendChild(ballContainer);

    // Create balls for each saved tab
    tabsArray.forEach(tab => {
      const ballElement = document.createElement('div');
      ballElement.className = 'tab-saver-ball';
      if (tab.id) { 
          ballElement.dataset.id = tab.id;
      }
      if (tab.url) {
          ballElement.dataset.url = tab.url;
      }

      // Add favicon as background or content of the ball
      if (tab.favicon) {
          const faviconImage = document.createElement('img');
          faviconImage.src = tab.favicon;
          faviconImage.alt = '';
          ballElement.appendChild(faviconImage);
      }

      // Add tooltip with title
      ballElement.title = tab.title || tab.url || 'Untitled Tab';
      // Add click event to open the tab
      ballElement.addEventListener('click', function() {
          // Send message to background script to open the tab
          chrome.runtime.sendMessage({
              action: "openTab", 
              url: tab.url
          });
      });
  
      ballContainer.appendChild(ballElement);
    });
    
    // Make the container draggable after it's created
    // We'll use the dragElement function from drag.js
    setTimeout(() => {
      if (typeof dragElement === 'function') {
        dragElement(document.getElementById('draggableTabContainer'));
      }
    }, 100);
  });
})
