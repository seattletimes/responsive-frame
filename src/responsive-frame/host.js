var trap = require("../trapString");
var guid = 0;

//frame is the iframe, messageCallback will be invoked on non-height messages
var Host = function(frame, messageCallback) {
  this.element = frame;
  this.id = guid++;
  this.state = "waiting";
  this.callback = messageCallback || function() {};
  this.init();
};

Host.prototype = {
  init: function() {
    var self = this;
    this.listener = function(e) {
      if (typeof e.data !== "string" || e.data.indexOf(trap) !== 0) return;
      self.onMessage(JSON.parse(e.data.replace(trap, "")));
    };
    window.addEventListener("message", this.listener);
    //send a note to the iframe with our ID
    var notify = function() {
      if (self.state !== "waiting") return;
      self.send({ type: "helo", id: self.id });
      setTimeout(notify, 100);
    };
    // if (this.element.contentDocument.readyState == "complete") notify();
    this.element.onload = function() {
      self.state = "waiting";
      notify();
    };
  },
  onMessage: function(message) {
    if (message.id !== this.id) return;
    if (message.type == "ready") {
      this.state = "ready";
    }
    if (message.height) {
      return this.element.height = message.height + "px";
    }
    this.callback(message);
  },
  send: function(message) {
    this.element.contentWindow.postMessage(trap + JSON.stringify(message), "*");
  },
  destroy: function() {
    window.removeEventListener("message", this.listener);
  }
};

module.exports = Host;
