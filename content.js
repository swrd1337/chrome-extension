chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === 'execute') {
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
    var logoURL, table, tbody, rows = null;

    logoURL = chrome.extension.getURL('images/pencil.png');
    table = document.querySelector('.files');

    try {
        tbody = table.querySelectorAll('tbody');
    } catch(error) {return;}

    rows  = tbody[tbody.length - 1].querySelectorAll('.js-navigation-item');
    var originalContent = rows[rows.length - 1].querySelector('.content');

    rows.forEach(row => {
        row.addEventListener('mouseenter', function(){
            var content = row.querySelector('.content');
            if (content === null) {return;}
            
            if(content.contains(content.querySelector('.waicon'))){
                return;
            }

            var url = content.childNodes[1].childNodes[0].href;
            var extension = url.split('/').pop().split('.').pop();
 
            if (extension === 'xml' || extension === 'dita'
                || extension === 'ditamap' || extension === 'ditaval') {
                
                var a = document.createElement('a');
                a.className = 'waicon'
                a.href = createOxyUrl(url);
                a.target = '_blank';
                a.style.display = 'inline-block';
                
                var imgpen = document.createElement('img');
                imgpen.title = 'Open in XML Web Author';
                imgpen.src = logoURL;
                imgpen.width = '14';
                imgpen.height = '14';
                a.appendChild(imgpen);
            
                content.appendChild(a);
 
            }
        });

        row.addEventListener('mouseout', function(){
            var content = row.querySelector('.content');
            if(content.querySelector('.waicon')){
                var state = false;
                var waicon = content.querySelector('.waicon');

                // waicon.addEventListener('mouseenter', function(){
                //     state = true;
                // });

                if(!state){
                    content.removeChild(content.querySelector('.waicon'));
                }
            }  
        });
    });
}

function addButtonInFileActions() {
    var logoURL = chrome.extension.getURL('images/pencil.png');
    var file = document.querySelector('.file');
    var file_actions = null;

    try{
        file_actions = file.querySelector('.file-actions');
    } catch(error) {return;}

    if(file.querySelector('.openwebauth')) {return;}

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

function createOxyUrl(url) {
    const LEN = 3;

    var host;
    chrome.storage.sync.get(['host'], function(result) {
        host = result.host;
    });

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