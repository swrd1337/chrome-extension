/**
 * Universal browser listener.
 * @param {*} listener 
 */
function addBrowserListener(listener) {
    if (typeof chrome !== 'undefined') {
        chrome.runtime.onMessage.addListener(listener);
    } else {
        browser.runtime.onMessage.addListener(listener);
    }
}


// Add page listener to browser.
addBrowserListener(function (request, sender, sendRespone) {
    if (request.method === 'execute') {
        enhancePage();            
    } 
    sendRespone({respone: 'OK'});
})


// Supported file extensions.
let supportedExtensions = {
    xml: '.xml',
    dita: '.dita',
    ditamap: '.ditamap',
    ditaval: '.ditaval',
    xhtml: '.xhtml'
}


/**
 * Adding Web Author buttons.
 */
function enhancePage() {
    let lastUrlFromTab = window.location.href.split('/').pop();
    let fileExtension = lastUrlFromTab.split('.');

    // Add Web Author button in every directory.
    addButtonsInTable();
    fileExtension = fileExtension.pop();
    // Add Web Author button only for opened files with these extensions.
    if (supportedExtensions.hasOwnProperty(fileExtension)) {
        addButtonInFileActions();
    }
}


/**
 * Return URL for penciol icon.
 * @param {*} imgUrl 
 */
function getPencilImage(imgUrl) {
    if (typeof chrome !== 'undefined') {
        return chrome.extension.getURL(imgUrl);
    } 
    return browser.extension.getURL(imgUrl);
}


/**
 * Create pencil icon for buttons.
 */
function createPencilImage() {
    let logoURL = getPencilImage('images/wa-pencil.png');
    let pencilImg = document.createElement('img');
    pencilImg.src = logoURL;
    pencilImg.width = '14';
    pencilImg.height = '14';

    return pencilImg;
}


/**
 * Return newly created button.
 */
function createEditButton() {
    let webAuthorButton = document.createElement('a');
    webAuthorButton.id = 'wa-link';
    webAuthorButton.title = 'Open with Oxygen XML Web Author.';
    webAuthorButton.target = '_blank';

    let pencilImg = createPencilImage(); 

    webAuthorButton.appendChild(pencilImg);

    return webAuthorButton;
}


// Our button.
let editButton = createEditButton();


/**
 * Utillity for adding button.
 * @param {*} spanNavContent 
 */
function addEditButton(spanNavContent) {
    removeEditButton(spanNavContent);
    spanNavContent.style.maxWidth = '85%';
    spanNavContent.parentNode.appendChild(editButton);
}


/**
 * Removing Web Author button if it was 
 * pushed in row.
 * @param {*} spanNavContent 
 */
function removeEditButton(spanNavContent) {
    let oldEditButton = document.getElementById('wa-link');
    if (oldEditButton) {
        // Cleanup the parent of the old parent of the edit button.
        let oldButtonParent = oldEditButton.parentElement;
        if (oldButtonParent) {
            oldButtonParent.removeChild(oldEditButton)
        }
        spanNavContent.style.maxWidth = '100%';
    }
}


/**
 * Add Web Author pencil button in documents table
 * when mouse is over row.
 */
function addButtonsInTable() {
    // Stable container where we add 'mouseover' event listener.
    let repoContainer = document.querySelector('#js-repo-pjax-container');

    if (repoContainer === null) {
        return;
    }

    repoContainer.classList.add('wa-initialized');
    repoContainer.addEventListener('mouseover', instertPencil);
}


/**
 * Return document row from direcotry.
 * @param {*} candidateRow 
 */
function getCandidateRow(candidateRow) {
    // Moving from the '#js-repo-pjax-container' to '.js-navigation-item' where we add Web Author button.
    while (!candidateRow.classList || !candidateRow.classList.contains('js-navigation-item')) {
        candidateRow = candidateRow.parentNode;
        if (!candidateRow) {
            return undefined;
        }
    }
    return candidateRow;
}


/**
 * Utillity for insertPencil.
 * @param {*} navigationContent 
 * @param {*} candidateRow 
 */
function instertPencilUtil(navigationContent, candidateRow) {
    let url = navigationContent.childNodes[1].firstChild.href;
    let fileExtension = url.split('/').pop().split('.').pop();
    
    if (supportedExtensions.hasOwnProperty(fileExtension)) {
        editButton.href = getWebAuthorUrl(url);
        // Get '.css-truncate.css-truncate-target' for button positioning.
        let spanNavContent = navigationContent.querySelector('.css-truncate.css-truncate-target');
        addEditButton(spanNavContent);

        // Remove the Web Author button and 'mouseleave' event when mouse leave 'js-navigation-item'.
        let onMouseLeave = () => {
            candidateRow.removeEventListener('mouseleave', onMouseLeave);
                removeEditButton(spanNavContent);
        }

        candidateRow.addEventListener('mouseleave', onMouseLeave);
    }
}


/**
 * Insert Pencil Icon in document row.
 * @param {*} e 
 */
function instertPencil(e) {
    let candidateRow = e.target;
    candidateRow = getCandidateRow(candidateRow);
    
    if (candidateRow === undefined) {
        return;
    }

    // Get the '.content' element from current candidateRow and check if already has WebAuthor button.
    let navigationContent = candidateRow.querySelector('.content');
    if (!navigationContent || navigationContent.contains(editButton)) {
        return;
    }

    instertPencilUtil(navigationContent, candidateRow);
}


/**
 * Create "Edit in Web Author" - buttton and return it.
 */
function createButtonInFileActions() {
    let webAuthorButton = document.createElement('a');
    webAuthorButton.href = getWebAuthorUrl(window.location.href);
    webAuthorButton.className = 'btn btn-sm BtnGroup-item';

    let imgUrl = getPencilImage('images/wa-pencil.png');

    webAuthorButton.innerHTML = `<img id="wa-link-icon" src="${imgUrl}"/>Edit in Web Author`;
    webAuthorButton.target = '_blank';
    webAuthorButton.id = 'walink';

    return webAuthorButton;
}


/**
 * Add "Edit in Web Author" - buttton in opened document.
 */
function addButtonInFileActions() {
    let fileActions = document.querySelector('.file-actions');
    let webAuthorButton = createButtonInFileActions();

    // Add out button at the first position to GitHub button group.
    // Check if we have another one before adding a new Web Author button.
    if (fileActions !== null) {
        let btnGroup = fileActions.querySelector('.BtnGroup');

        if (btnGroup.contains(fileActions.querySelector('#walink'))) {
            return;
        }
        // Appeding the newly created Web Author button.
        btnGroup.insertBefore(webAuthorButton, btnGroup.firstChild);
    }
}


// Get the setted host from browser storage.
let webAuthorHost;   
getWebAuthorHost(function (item) {
    if (item.value !== undefined) {
       return webAuthorHost = item.value.host;
    }
    webAuthorHost = '#';
});


/**
 * Universal utillity function to get dashboard host.
 * @param {*} fn 
 */
function getWebAuthorHost (fn) {
    if (typeof chrome !== 'undefined') {
        chrome.storage.sync.get('value', fn);
    } else {
        browser.storage.sync.get('value', fn);
    }
}


/**
 * Create and return newly created URL for Web Author GitHub.
 * @param {*} url 
 */
function getWebAuthorUrl(url) {
    let firstComponent = 'https://github.com';
    let ghProtocol = 'gitgh://';
    let queryPart = '?url=';

    url = url.replace(firstComponent, '');
    let splitedUrl = url.split('/');

    // Removing useless elemenets from array and build url for github document.
    splitedUrl.length = 3;

    for(const element of splitedUrl){
        if (element !== '') {
            firstComponent += ('/' + element);
            url = url.replace(element + '/', '');
        }
    }

    // Encode the document url twice for query part of Web Author url. 
    firstComponent = encodeURIComponent(encodeURIComponent(firstComponent));
    // Building the final Web Author url for our buttons.
    let secondComponent = encodeURIComponent(url.replace('blob/', ''));
    let webauthorUrl = webAuthorHost + queryPart + encodeURIComponent(ghProtocol) + firstComponent + secondComponent;

    return webauthorUrl;
}
