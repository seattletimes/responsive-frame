define([
  "template!./_template.html",
  "./host",
  "less!./responsive-frame.less"
], function(template, Host) {

  var proto = Object.create(HTMLElement.prototype);
  proto.createdCallback = function() {
    var src = this.getAttribute("src");
    this.innerHTML = template({ src: src });
    this.host = new Host(this.querySelector("iframe"));
  };

  document.registerElement("responsive-frame", { prototype: proto });

});