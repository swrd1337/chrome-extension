chrome.storage.sync.get(['host'], function (result) {
    if (result.host !== '') {
        document.getElementById('host').value = result.host;
        updateIconHref(result.host);
    } else {
        updateIconHref('https://www.oxygenxml.com/xml_web_author.html');
    }
});

function updateIconHref(host) {
    document.getElementById('oxygen-link').href = host;
}