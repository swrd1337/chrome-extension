// Set the last Web Author url in the input form.
document.getElementById('save').addEventListener('click', function () {
    var value = document.getElementById('host').value;
    chrome.storage.sync.set({
        host: value
    });
});


// Update Chrome tab when save button is pressed.
document.getElementById('save').addEventListener('click', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.update(tabs[0].id, {
            url: tabs[0].url
        });
    });
    window.close();
});

// Close popup on cancel.
document.getElementById('cancel').addEventListener('click', function () {
    window.close();
});