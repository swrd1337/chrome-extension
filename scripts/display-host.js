chrome.storage.sync.get(['host'], function (result) {
    if (result.host !== undefined) {
        document.getElementById('host').value = result.host;
        updateIconHref(result.host);
    }
});

function updateIconHref(host) {
    document.getElementById('oxygen-link').href = host;
}