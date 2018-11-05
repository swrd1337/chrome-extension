(function () {
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.method === 'execute') {
            enhancePage();
        }
    });


    var supportedExtensions = {
        xml: '.xml',
        dita: '.dita',
        ditamap: '.ditamap',
        ditaval: '.ditaval',
        xhtml: '.xhtml'
    }


    function enhancePage() {
        var lastUrlFromTab = window.location.href.split('/').pop();
        var fileExtension = lastUrlFromTab.split('.');

        // Add Web Author button in every directory.
        addButtonsInTable();

        fileExtension = fileExtension.pop();

        // Add Web Author button only for opened files with these extensions.
        if (supportedExtensions.hasOwnProperty(fileExtension)) {
            addButtonInFileActions();
        }
    }


    function createEditButton() {
        var webAuthorButton = document.createElement('a');
        webAuthorButton.id = 'wa-link';
        webAuthorButton.title = 'Open with Oxygen XML Web Author.';
        webAuthorButton.target = '_blank';

        var logoURL = chrome.extension.getURL('images/wapencil.png');
        var pencilImg = document.createElement('img');
        pencilImg.src = logoURL;
        pencilImg.width = '14';
        pencilImg.height = '14';

        webAuthorButton.appendChild(pencilImg);

        return webAuthorButton;
    }


    var editButton = createEditButton();


    function addEditButton(spanNavContent) {
        removeEditButton(spanNavContent);
        spanNavContent.style.maxWidth = '85%';
        spanNavContent.parentNode.appendChild(editButton);
    }


    function removeEditButton(spanNavContent) {
        var oldEditButton = document.getElementById('wa-link');
        if (oldEditButton) {
            // Cleanup the parent of the old parent of the edit button.
            var oldButtonParent = oldEditButton.parentElement;
            if (oldButtonParent) {
                oldButtonParent.removeChild(oldEditButton)
            }
            spanNavContent.style.maxWidth = '100%';
        }
    }


    function addButtonsInTable() {
        // Stable container where we add 'mouseover' event listener.
        var repoContainer = document.querySelector('#js-repo-pjax-container');

        if (repoContainer === null) {
            return;
        }

        repoContainer.classList.add('wa-initialized');

        repoContainer.addEventListener('mouseover', e => {
            var candidateRow = e.target;

            // Moving from the '#js-repo-pjax-container' to '.js-navigation-item' where we add Web Author button.
            while (!candidateRow.classList || !candidateRow.classList.contains('js-navigation-item')) {
                candidateRow = candidateRow.parentNode;
                if (!candidateRow) {
                    return;
                }
            }

            // Get the '.content' element from current candidateRow and check if already has WebAuthor button.
            var navigationContent = candidateRow.querySelector('.content');
            if (!navigationContent || navigationContent.contains(editButton)) {
                return;
            }

            var url = navigationContent.childNodes[1].firstChild.href;
            var fileExtension = url.split('/').pop().split('.').pop();

            if (supportedExtensions.hasOwnProperty(fileExtension)) {

                editButton.href = getWebAuthorUrl(url);

                // Get '.css-truncate.css-truncate-target' for button positioning.
                var spanNavContent = navigationContent.querySelector('.css-truncate.css-truncate-target');
                addEditButton(spanNavContent);

                // Remove the Web Author button and 'mouseleave' event when mouse leave 'js-navigation-item'.
                var onMouseLeave = () => {
                    candidateRow.removeEventListener('mouseleave', onMouseLeave);
                        removeEditButton(spanNavContent);
                }

                candidateRow.addEventListener('mouseleave', onMouseLeave);
            }
        });
    }


    function createButtonInFileActions() {
        var webAuthorButton = document.createElement('a');
        webAuthorButton.href = getWebAuthorUrl(window.location.href);
        webAuthorButton.className = 'btn btn-sm BtnGroup-item';
        webAuthorButton.innerHTML = 'Oxygen XML Web Author';
        webAuthorButton.target = '_blank';
        webAuthorButton.id = 'walink';

        return webAuthorButton;
    }


    function addButtonInFileActions() {
        var fileActions = document.querySelector('.file-actions');
        var webAuthorButton = createButtonInFileActions();

        // Add out button at the first position to GitHub button group.
        // Check if we have another one before adding a new Web Author button.
        if (fileActions !== null) {
            var btnGroup = fileActions.querySelector('.BtnGroup');

            if (btnGroup.contains(fileActions.querySelector('#walink'))) {
                return;
            }

            // Appeding the newly created Web Author button.
            btnGroup.insertBefore(webAuthorButton, btnGroup.firstChild);
        }
    }


    // Get the setted host from chrome storage.
    var webAuthorHost;
    chrome.storage.sync.get(['host'], function (result) {
        webAuthorHost = result.host;
    });


    function getWebAuthorUrl(url) {
        var firstComponent = 'https://github.com';
        var ghProtocol = 'gitgh://';
        var queryPart = '?url=';

        url = url.replace(firstComponent, '');
        var splitedUrl = url.split('/');

        // Removing useless elemenets from array and build url for github document.
        splitedUrl.length = 3;

        for(var element of splitedUrl){
            if (element !== '') {
                firstComponent += ('/' + element);
                url = url.replace(element + '/', '');
            }
        }

        // Encode the document url twice for query part of Web Author url. 
        firstComponent = encodeURIComponent(encodeURIComponent(firstComponent));

        // Building the final Web Author url for our buttons.
        var secondComponent = encodeURIComponent(url.replace('blob/', ''));
        var webauthorUrl = webAuthorHost + queryPart + encodeURIComponent(ghProtocol) + firstComponent + secondComponent;

        return webauthorUrl;
    }
}())