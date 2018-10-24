chrome.storage.sync.get(['host'], function (result) {
    if (result.host !== undefined) {
        document.getElementById('host').value = result.host;
    }
});