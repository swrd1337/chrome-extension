chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == 'execute') {
        var checkIf = false;
        var tabUrlLastComp = window.location.href.split('/').pop();
        var extension = tabUrlLastComp.split('.');

        if (extension.length === 1 || extension[0] === '') {
            addButtonsInTable();
            checkIf = true;
        }

        extension = extension.pop();

        if ((extension === 'xml' || extension === 'dita'
                || extension === 'ditamap' || extension === 'ditaval') && !checkIf) {
            addButtonInFileActions();
        }
    }
});

function addButtonsInTable() {
    var logoURL = chrome.extension.getURL('images/pencil.png');
    var table, tbody, rows = null;
    table = document.querySelector('.files');

    try{
        tbody = table.querySelectorAll('tbody');
    } catch (error) {
        return;
    }

    rows  = tbody[tbody.length - 1].querySelectorAll('.js-navigation-item');

    if (table !== null && tbody !== null && rows !== null) {
        for (var row = 0; row < rows.length; row++) {
            var content = rows[row].querySelector('.content');
            
            if (content === null) {
                return;
            }
    
            var url = content.childNodes[1].childNodes[0].href;
            var extension = url.split('/').pop().split('.');

            console.log(url);

            if (extension.length == 1 || extension[0] === '') {
                continue;
            } 

            extension = extension.pop();
            
            if (extension === 'xml' || extension === 'dita'
                || extension === 'ditamap' || extension === 'ditaval') {
    
                var icon = rows[row].querySelector('.icon');
                var svg = icon.querySelector('svg');
                var img = icon.querySelector('img');

                if (svg === null || img === null ) {
                    break;
                }

                icon.removeChild(svg);
                icon.removeChild(img);
    
                var a = document.createElement('a');
                a.href = createOxyUrl(url);
                a.target = '_blank';
                a.style.display = 'inline-block';
    
                var img = document.createElement('img');
                img.title = 'Open in XML Web Author';
                img.src = logoURL;
                img.width = '14';
                img.height = '14';
                a.appendChild(img);
                
                if(!icon.contains(a)){
                    icon.appendChild(a);
                }
            }
        }
    }
}

function addButtonInFileActions() {
    var logoURL = chrome.extension.getURL('images/pencil.png');

    var file = document.querySelector('.file');
    var file_actions = file.querySelector('.file-actions');

    if(file.querySelector('.openwebauth')){
        return;
    }

    if(file !== null && file_actions !== null){

        var a = document.createElement('a');
        a.className = 'openwebauth';
        a.href = createOxyUrl(window.location.href);
        a.target = '_blank';
        a.style.marginRight = '5px';
        a.style.padding = '5px';
        a.style.border = '0';
        a.style.display = 'inline-block';
        a.style.verticalAlign = 'middle';
        a.style.lineHeight = '1';
        
        if(!file_actions.classList.contains(a.className)){
            file_actions.insertBefore(a, file_actions.firstChild);
        }

        var img = document.createElement('img');
        img.title = 'Open in XML Web Author';
        img.width = '15';
        img.height = '15';
        img.src = logoURL;
        a.appendChild(img);
    }    
}


var host;
chrome.storage.sync.get(['host'], function(result) {
    host = result.host;
});

function createOxyUrl(url) {
    const LEN = 3;

    var ghprotocol = 'gitgh://';
    var firstComponent = 'https://github.com';
    
    url = url.replace(firstComponent, '');
    var splitUrl = url.split('/');

    // FirstComponent is of form https://github.com/USER/REPOSITORY and double encoded.
    for (var i = 0; i < LEN; i++) {
        if(splitUrl[i] !== ''){
            firstComponent += '/' + splitUrl[i];
            url = url.replace(splitUrl[i] + '/' , '');
        }
    }

    firstComponent = encodeURIComponent(encodeURIComponent(firstComponent));

    // secondComponent is of form /BRANCH/PATH_TO_FILE and encoded.
    var secondComponent = url.replace('blob/', '');
    secondComponent = encodeURIComponent(secondComponent);

    var oxyUrl = host + '?url='
    oxyUrl +=  encodeURIComponent(ghprotocol) + firstComponent + secondComponent;

    return oxyUrl;
}