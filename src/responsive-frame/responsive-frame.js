var template = require("./_template.html");
var Host = require("./host");
require("./responsive-frame.less");
require("document-register-element");

var proto = Object.create(HTMLElement.prototype);
proto.createdCallback = function() {
  var src = this.getAttribute("src");
  this.innerHTML = template({ src: src });
  this.host = new Host(this.querySelector("iframe"));
};

proto.sendMessage = function(message) {
  this.host.send(message);
};

document.registerElement("responsive-frame", { prototype: proto });