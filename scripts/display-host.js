// Help us to check if browser is chrome or not.
const IS_CHROME = chrome.declarativeContent;


/**
 * Save dashboard host in browser storage.
 * @param {*} fn 
 */
function setExtensionHost(fn) {
    if (IS_CHROME !== undefined) {
        chrome.storage.sync.get('value', fn);
    } else {
        browser.storage.sync.get('value', fn);
    }
}

 
 // Calling this fucntion with callback.
setExtensionHost(function(item) {
    if (item.value !== undefined && item.value !== '') {
        let displayHost = item.value.host;
        document.getElementById('host').value = displayHost;
    }
});
