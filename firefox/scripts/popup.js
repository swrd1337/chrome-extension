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


document.addEventListener('DOMContentLoaded', function() {
    popupActivation(document, false);

    browser.tabs.query({
        url: '*://github.com/*',
        active: true,
        currentWindow: true
    }, function(tabs) {
        tabs.forEach(tab => {
            if (tab.url.indexOf('://github.com/') !== -1) {
                popupActivation(document, true);
            }
        });
    })
});

var popContext = {
    originalClass: 'primary-button extension-button',
    blockClass: 'on-block extension-button',
    originalSrc: 'images/web-author.png',
    blockSrc: 'images/blocked-web-author.png',
    originalInfo: 'Enter the URL of the Oxygen XML Web Author dashboard',
    blockInfo: 'Only accessible on GitHub pages!'
}

function popupActivation(doc, condition) {
    var hostInput = doc.querySelector('#host');
    
    hostInput.disabled = condition ? false : true;

    var saveButton = doc.querySelector('#save');
    
    saveButton.disabled = condition ? false : true;
    saveButton.className = condition ? popContext.originalClass : popContext.blockClass;

    var image = doc.querySelector('#web-author-img');

    image.src = condition ? popContext.originalSrc : popContext.blockSrc;

    var extensionInfo = doc.querySelector('#extension-info');

    extensionInfo.innerHTML = condition ? popContext.originalInfo : popContext.blockInfo;
}
