var trap = "while (true);";
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
    window.addEventListener("message", function(e) {
      if (typeof e.data !== "string" || e.data.indexOf(trap) !== 0) return;
      self.onMessage(JSON.parse(e.data.replace(/^.*?;/, "")));
    });
    //send a note to the iframe with our ID
    var notify = function() {
      if (self.state !== "waiting") return;
      self.send({ type: "helo", id: self.id });
      setTimeout(notify, 100);
    };
    notify();
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
  }
};

module.exports = Host;
