// Help us to check if browser is chrome or not.
const IS_CHROME = chrome.declarativeContent;

function setExtensionHost(fn) {
    if (IS_CHROME !== undefined) {
        chrome.storage.sync.get('value', fn);
    } else {
        browser.storage.sync.get('value', fn);
    }
}

setExtensionHost(function(item) {
    if (item.value !== undefined && item.value !== '') {
        let displayHost = item.value.host;
        document.getElementById('host').value = displayHost;
        updateIconHref(displayHost);
    } else {
        updateIconHref('https://www.oxygenxml.com/xml_web_author.html');
    }   
});

function updateIconHref(host) {
    document.getElementById('oxygen-link').href = host;
}