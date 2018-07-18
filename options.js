function save_options() {
  var value = document.getElementById('host').value;
  chrome.storage.sync.set({
    host: value
  });
}

function updateHost() {
    var host = document.getElementById('host').value;
    document.getElementById('infoAboutHost').innerHTML = "(current host is " + host + ")";
}

document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('save').addEventListener('click',
    updateHost);