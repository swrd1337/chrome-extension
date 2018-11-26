// Set the last Web Author url in the input form.
document.getElementById('save').addEventListener('click', function () {
    var value = {
        host: document.getElementById('host').value
    };

    browser.storage.sync.set({value});
});


// Update Chrome tab when save button is pressed.
document.getElementById('save').addEventListener('click', function () {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        browser.tabs.update(tabs[0].id, {
            url: tabs[0].url
        });
        this.window.close();
    });
});

// Close popup on cancel.
document.getElementById('cancel').addEventListener('click', function () {
    window.close();
});