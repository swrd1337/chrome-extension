browser.storage.sync.get('value').then(function(item) {
    var displayHost = item.value.host;

    if (displayHost !== '' && displayHost !== undefined) {
        document.getElementById('host').value = displayHost;
        updateIconHref(displayHost);
    } else {
        updateIconHref('https://www.oxygenxml.com/xml_web_author.html');
    }   
});

function updateIconHref(host) {
    document.getElementById('oxygen-link').href = host;
}