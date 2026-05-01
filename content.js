(function injectFile() {
  const url = chrome.runtime.getURL("inject.js");
  const script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
})();
