chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method === 'execute') {
        var checkIf = false;
        var tabUrlLastComp = window.location.href.split('/').pop();
        var extension = tabUrlLastComp.split('.');

        if (extension.length === 1 || extension[0] === '') {
            addButtonsInTable();
            checkIf = true;
        }

        extension = extension.pop();

        if ((extension === 'xml' || extension === 'dita' ||
                extension === 'ditamap' || extension === 'ditaval') && !checkIf) {
            addButtonInFileActions();
        }
    }
});

//TODO Flexbox!!!!
function createEditButton() {
    var a = document.createElement('a');
    a.title = 'Open in XML Web Author';
    a.target = '_blank';
    a.style.display = 'inline-block';

    var logoURL = chrome.extension.getURL('images/pencil.png');
    var imgpen = document.createElement('img');
    imgpen.src = logoURL;
    imgpen.width = '14';
    imgpen.height = '14';

    a.appendChild(imgpen);

    return a;
}

function addButtonsInTable() {
    var table = document.querySelector('.repository-content');
    if (table.classList.contains('wa-initialized')) {
        return;
    }
    table.classList.add('wa-initialized');
    var a = createEditButton();
    
    table.addEventListener('mouseover', function onFileHover(e) {
        var candidateRow = e.target;
        while (!candidateRow.className || candidateRow.className.indexOf('js-navigation-item') === -1) {
            candidateRow = candidateRow.parentNode;
            if (!candidateRow) {
                return;
            }
        }
    
        var content = candidateRow.querySelector('.content');
        if (!content || content.contains(a)) {
            return;
        }

        var url = content.childNodes[1].firstChild.href;
        var extension = url.split('/').pop().split('.').pop();
    
        if (extension === 'xml' || extension === 'dita' ||
            extension === 'ditamap' || extension === 'ditaval') {
    
            a.href = createOxyUrl(url);
            content.appendChild(a);
    
            // TODO inject span relative img absolute!!!
    
            function onMouseLeave(e) {
                candidateRow.removeEventListener('mouseleave', onMouseLeave);
                if (e.isTruseted !== true) {
                    try {
                        a.parentElement.removeChild(a);
                    } catch (error) {
                        
                        return;
                    }
                }
            }            
    
            candidateRow.addEventListener('mouseleave', onMouseLeave);
        }
    });  
}

function addButtonInFileActions() {
    var file = document.querySelector('.file');
    var file_actions = null;

    try {
        file_actions = file.querySelector('.file-actions');
    } catch (error) {
        return;
    }

    if (file !== null && file_actions !== null) {
        var btnGroup = file_actions.querySelector('.BtnGroup');
        var a = document.createElement('a');
        a.href = createOxyUrl(window.location.href);
        a.className = 'btn btn-sm BtnGroup-item';
        a.innerHTML = 'Web Author';
        a.target = '_blank';
        a.id = 'walink';

        if (btnGroup.contains(btnGroup.querySelector('#walink'))) {
            return;
        }

        btnGroup.insertBefore(a, btnGroup.firstChild);
    }
}

var host;
chrome.storage.sync.get(['host'], function (result) {
    host = result.host;
});

function createOxyUrl(url) {
    const LEN = 3;
    var firstComponent = 'https://github.com';
    var ghprotocol = 'gitgh://';
    var qurl = '?url=';

    url = url.replace(firstComponent, '');
    var splitUrl = url.split('/');

    for (var i = 0; i < LEN; i++) {
        if (splitUrl[i] !== '') {
            firstComponent += '/' + splitUrl[i];
            url = url.replace(splitUrl[i] + '/', '');
        }
    }

    firstComponent = encodeURIComponent(encodeURIComponent(firstComponent));

    var secondComponent = encodeURIComponent(url.replace('blob/', ''));
    var oxyUrl = host + qurl + encodeURIComponent(ghprotocol) + firstComponent + secondComponent;

    return oxyUrl;
}