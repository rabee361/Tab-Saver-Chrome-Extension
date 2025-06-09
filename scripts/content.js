
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

    // Add style to the page
    const style = document.createElement('style');
    style.textContent = `
      .tab-saver-balls-container {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 70px;
        background-color: rgba(245, 245, 245, 0.9);
        padding: 10px;
        border-radius: 0 10px 10px 0;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        z-index: 10000;
        cursor: grab;
      }
      
      .tab-saver-ball-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;
      }
      
      .tab-saver-ball {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      
      .tab-saver-ball:hover {
        transform: scale(1.1);
        background-color: #d0d0d0;
      }
      
      .tab-saver-ball img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .tab-saver-no-tabs {
        color: #666;
        font-size: 12px;
        text-align: center;
      }
    `;
    document.head.appendChild(style);

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
      if (tab.url) {
          ballElement.addEventListener('click', function() {
              chrome.tabs.create({ url: tab.url });
          });
      }

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
