// Execute our content.js when tab url is equal with github url.
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    browser.tabs.query({
        url: '*://github.com/*',
        active: true,
        currentWindow: true
    }, function (tabs) {
        tabs.forEach(function (tab) {
            browser.tabs.sendMessage(tab.id, {
                method: 'execute'
            }, function (response) {
                if (response === 'OK') {
                    return;
                }
            });
        });
    });
});
