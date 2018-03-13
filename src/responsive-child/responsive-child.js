require("document-register-element");
require("./responsive-child.less");
var makeEvent = require("../makeEvent");
var Guest = require("./guest.js");

var proto = Object.create(HTMLElement.prototype);
var bodyProto = Object.create(HTMLBodyElement.prototype);
bodyProto.createdCallback = proto.createdCallback = function() {
  var self = this;
  var guest = this.guest = new Guest(this, function(data) {
    //message from the host
    var event = makeEvent("message", { data: data });
    self.dispatchEvent(event);
  });
  //set a default interval, but interval=0 still disables it.
  var interval = this.getAttribute("interval") || 100;
  interval *= 1;
  if (interval) {
    var height = null;
    var loop = function() {
      var h = self.offsetHeight;
      // don't message if nothing has changed
      if (h != height) guest.notify("interval");
      height = h;
      setTimeout(loop, interval);
    };
    loop();
  }
};
bodyProto.sendMessage = proto.sendMessage = function(message) {
  this.guest.send(message);
};
bodyProto.guest = proto.guest = null;

try {
  document.registerElement("responsive-body", { prototype: bodyProto, extends: "body" });
  document.registerElement("responsive-child", { prototype: proto });
} catch (_) {
  if (window.console && console.log) console.log("<responsive-child> is already registered.");
}