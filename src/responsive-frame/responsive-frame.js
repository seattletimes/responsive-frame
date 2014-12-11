var template = require("./_template.html");
var Host = require("./host");
require("./responsive-frame.less");
require("document-register-element");

var proto = Object.create(HTMLElement.prototype);
proto.createdCallback = function() {
  var src = this.getAttribute("src");
  this.innerHTML = template({ src: src });
  var self = this;
  this.host = new Host(this.querySelector("iframe"), function(data) {
    self.dispatchEvent(new MessageEvent("childmessage", { data: data, bubbles: true }));
  });
};

proto.sendMessage = function(message) {
  this.host.send(message);
};

document.registerElement("responsive-frame", { prototype: proto });