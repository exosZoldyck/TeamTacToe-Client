let urlParams = new URLSearchParams(window.location.search);
let roomIdParam = urlParams.get('room');

function reloadUrlVariables(){
    urlParams = new URLSearchParams(window.location.search);
    roomIdParam = urlParams.get('room');
}

function rebuildURL(){
    const newUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({}, '', newUrl);
}