/*
Host is the equivalent of pym.Parent - call it to register an iframe as responsive
*/
define(function() {

  var trap = "while (true);";
  var guid = 0;

  var Host = function(frame) {
    this.element = frame;
    this.id = guid++;
    this.state = "waiting";
    this.init();
  };

  Host.prototype = {
    init: function() {
      var self = this;
      window.addEventListener("message", function(e) {
        if (e.data.indexOf(trap) !== 0) return;
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
        this.element.height = message.height + "px";
      }
    },
    send: function(message) {
      this.element.contentWindow.postMessage(trap + JSON.stringify(message), "*");
    }
  };

  return Host;

});