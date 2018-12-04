// Help us to check if browser is chrome or not.
const IS_CHROME = chrome.declarativeContent;

// Execute our content.js when tab url is equal with github url.
if (IS_CHROME !== undefined) {
    chrome.tabs.onUpdated.addListener(tabListener);
    chrome.runtime.onInstalled.addListener(onChromeStart);
} else {
    browser.tabs.onUpdated.addListener(tabListener);
}

function tabListener() {
    let tabOption = {
        url: '*://github.com/*',
        active: true,
        currentWindow: true
    }
    
    if (IS_CHROME !== undefined) {
        chrome.tabs.query(tabOption, tabQuery);
    } else {
        browser.tabs.query(tabOption, tabQuery);
    }
}

function tabQuery(tabs) {
    tabs.forEach(function (tab) {
        let option = {method: 'execute'};

        if (IS_CHROME !== undefined) {
            chrome.tabs.sendMessage(tab.id, option, responseHandler);
        } else {
            browser.tabs.sendMessage(tab.id, option, responseHandler);
        }
    });
}

function responseHandler(response) {
    if (response === 'OK') {
        return;
    }
}

function onChromeStart() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    hostEquals: 'github.com'
                },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
}
