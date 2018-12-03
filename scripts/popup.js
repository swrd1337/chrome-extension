// Help us to check if browser is chrome or not.
const IS_CHROME = chrome.declarativeContent;

// Set the last Web Author url in the input form.
document.getElementById('save').addEventListener('click', function () {
    let value = {
        host: document.getElementById('host').value
    };

    if (IS_CHROME !== undefined) {
        chrome.storage.sync.set({value});        
    } else {
        browser.storage.sync.set({value});
    }

    queryTabs({
        active: true,
        currentWindow: true        
    }, tabsUtil);    
});

function queryTabs(options, fn) {
    if (IS_CHROME !== undefined) {
        chrome.tabs.query(options, fn);
    } else {
        browser.tabs.query(options, fn);
    }
}

function tabsUtil(tabs) {
    if (IS_CHROME !== undefined) {
        chrome.tabs.update(tabs[0].id, {
            url: tabs[0].url
        });    
    } else {
        browser.tabs.update(tabs[0].id, {
            url: tabs[0].url
        });
    }
    window.close();
}

// Close popup on cancel.
document.getElementById('cancel').addEventListener('click', function () {
    window.close();
});

document.addEventListener('DOMContentLoaded', function() {
    let body = document.querySelector('#popup-body');
    if (IS_CHROME !== undefined) {
        body.className = 'gc-popup-body';
    } else {
        body.className = 'ff-popup-body';
    }
});

