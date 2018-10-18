document.getElementById('save').addEventListener('click', function(){
    var value = document.getElementById('host').value;
    chrome.storage.sync.set({
      host: value
    });
});

document.getElementById('save').addEventListener('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
    window.close();
});

document.getElementById('cancel').addEventListener('click', function(){
    window.close();
});