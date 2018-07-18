chrome.storage.sync.get(['host'], function(result) {
    document.getElementById('infoAboutHost').innerHTML = "(current host is " + result.host + ")";
});