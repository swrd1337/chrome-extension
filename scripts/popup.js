// Help us to check if browser is chrome or not.
var isChrome = chrome.declarativeContent;

// Set the last Web Author url in the input form.
document.getElementById('save').addEventListener('click', function () {
    var value = {
        host: document.getElementById('host').value
    };

    if (isChrome !== undefined) {
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
    if (isChrome !== undefined) {
        chrome.tabs.query(options, fn);
    } else {
        browser.tabs.query(options, fn);
    }
}

function tabsUtil(tabs) {
    if (isChrome !== undefined) {
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
    var body = document.querySelector('#popup-body');
    if (isChrome !== undefined) {
        body.className = 'gc-popup-body';
    } else {
        body.className = 'ff-popup-body';
    }
});

