chrome.runtime.onInstalled.addListener(() => {
    console.log('working...');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['inject.js'],
    });
});
