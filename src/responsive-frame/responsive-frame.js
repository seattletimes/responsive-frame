var Host = require("./host");
require("document-register-element");
var makeEvent = require("../makeEvent");

var proto = Object.create(HTMLElement.prototype);
var iframeProto = Object.create(HTMLIFrameElement.prototype);
proto.createdCallback = iframeProto.createdCallback = function() {
  var src = this.getAttribute("src");
  var element;
  if (this.tagName.toLowerCase() == "iframe") {
    element = this;
  } else {
    var root = this.createShadowRoot ? this.createShadowRoot() : this;
    this.style.display = "block";
    element = document.createElement("iframe");
    element.src = src;
    root.appendChild(element);
  }
  element.setAttribute("seamless", "");
  element.setAttribute("width", "100%");
  element.setAttribute("scrolling", "no");
  element.setAttribute("horizontalscrolling", "no");
  element.setAttribute("verticalscrolling", "no");
  element.setAttribute("frameborder", "0");
  element.setAttribute("marginwidth", "0");
  element.setAttribute("marginheight", "0");
  element.setAttribute("mozallowfullscreen", "");
  element.setAttribute("webkitallowfullscreen", "");
  element.setAttribute("allowfullscreen", "");
  element.style.display = "block";
  var self = this;
  this.host = new Host(element, function(data) {
    self.dispatchEvent(makeEvent("childmessage", { data: data, bubbles: true }));
  });
};

proto.sendMessage = iframeProto.sendMessage = function(message) {
  this.host.send(message);
};

try {
  document.registerElement("responsive-frame", { prototype: proto });
  document.registerElement("responsive-iframe", { prototype: iframeProto, extends: "iframe" });
} catch (_) {
  if (window.console && console.log) console.log("<responsive-iframe> is already registered");
}