chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "executeScript") {

        var tabUrlLastComp = window.location.href.split('/').pop();
        var extension = tabUrlLastComp.split('.');

        if (extension.length == 1) {
            addButtonsInTable();
            return;
        }

        extension = extension.pop();

        if (extension == 'xml' || extension == 'dita'
                || extension == 'ditamap' || extension == 'ditaval') {
            addButtonInFileActions();
        }
    }
});

function addButtonsInTable() {
    var logoURL = chrome.extension.getURL('images/pencil16.png');

    var table = document.querySelector('.files');
    if (table === null) {
        return;
    }

    var tbody = table.querySelectorAll('tbody');
    if (tbody === null) {
        return;
    }

    var rows = tbody[tbody.length - 1].querySelectorAll('.js-navigation-item');
    if (rows === null) {
        return;
    }

    for (var row = 0; row < rows.length; row++) {
        var content = rows[row].querySelector('.content');
        if (content === null) {
            return;
        }

        var url = content.childNodes[1].childNodes[0].href;
        var extension = url.split('/').pop().split('.');
        if (extension.length == 1) {
            continue;
        } else {
            extension = extension.pop();
        }

        if (extension == 'xml' || extension == 'dita'
            || extension == 'ditamap' || extension == 'ditaval') {

            var icon = rows[row].querySelector('.icon');

            var svg = icon.querySelector('svg');
            if (svg === null) {
                return;
            }
            icon.removeChild(svg);

            var img = icon.querySelector('img');
            if (img === null) {
                return;
            }
            icon.removeChild(img);

            var a = document.createElement('a');
            a.href = createOxyUrl(url);
            a.target = "_blank";
            a.style.display = "inline-block";
            icon.appendChild(a);

            var img = document.createElement('IMG');
            img.title = "Open in XML Web Author";
            img.src = logoURL;
            img.width = "14";
            img.height = "14";
            a.appendChild(img);
        }
    }
}

function addButtonInFileActions() {
    var logoURL = chrome.extension.getURL('images/pencil16.png');

    var file = document.querySelector('.file');
    if (file === null) {
        return;
    }

    var file_actions = file.querySelector('.file-actions');
    if (file_actions === null) {
        return;
    }

    if (file_actions.querySelector('.openwebauth') !== null) {
        return;
    }

    var a = document.createElement('a');
    a.className = "openwebauth";
    a.href = createOxyUrl(window.location.href);
    a.target = "_blank";
    a.style.marginRight = "5px";
    a.style.padding = "5px";
    a.style.border = "0";
    a.style.display = "inline-block";
    a.style.verticalAlign = "middle";
    a.style.lineHeight = "1";
    file_actions.insertBefore(a, file_actions.firstChild);

    var img = document.createElement('IMG');
    img.title = "Open in XML Web Author";
    img.width = "15";
    img.height = "15";
    img.src = logoURL;
    a.appendChild(img);
}

function createOxyUrl(url) {
    // build the OXY-URL
    // OXY-URL is of form gitgh://REPOSITORY_URI/BRANCH/PATH_TO_FILE

    var i, splitUrl = url.split("/");

    var protocol = "gitgh";

    // firstComponent is of form https://github.com/USER/REPOSITORY
    // firstComponent is double encoded
    var firstComponent = "https://github.com";
    for (i = 3; i <= 4; i++) {
        firstComponent += "/" + splitUrl[i];
    }
    firstComponent = encodeURIComponent(firstComponent);
    firstComponent = encodeURIComponent(firstComponent);

    // secondComponent is of form /BRANCH/PATH_TO_FILE
    // secondComponent is encoded
    var secondComponent = "";
    for (i = 6; i < splitUrl.length; i++) {
        secondComponent += "/" + splitUrl[i];
    }
    secondComponent = encodeURIComponent(secondComponent);

    var oxyUrl = "https://www.oxygenxml.com/oxygen-xml-web-author/" +
                                                    "app/oxygen.html?url=";
    oxyUrl += protocol + encodeURIComponent("://")
                                + firstComponent + secondComponent;

    return oxyUrl;
}