module.exports = function(type, detail) {
  if (typeof window.MessageEvent == "function") {
    return new MessageEvent(type, detail);
  }
  var event = document.createEvent("CustomEvent");
  event.initCustomEvent(type, detail.bubbles, false, detail);
  event.data = detail.data;
  return event;
}