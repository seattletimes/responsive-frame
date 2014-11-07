/*
  template! plugin - requires Node build process, doesn't work in browser
  Produces compiled template modules for loading
*/

define(function() {
  if (typeof document !== "undefined" && typeof process == "undefined") {
    return {};
  }

  var dot = require.nodeRequire("dot");
  var fs = require.nodeRequire("fs");
  var path = require.nodeRequire("path");

  dot.templateSettings.varname = "data";
  dot.templateSettings.selfcontained = true;

  var _ = function(tmp) {
    return tmp.toString().replace(/^.*\/\*\n*\s*|\*\/\}$/gm, "");
  };

  var lessTemplate = function() {/*
define("template!{{file}}", function() {
  return {{function}};
});
  */};

  var cache = {};

  return {
    load: function(name, req, onLoad, config) {
      var file = fs.readFileSync(path.join(config.baseUrl, name), { encoding: "utf8" });
      var compiled = dot.compile(file);
      cache[name] = compiled.toString();
      onLoad();
    },
    write: function(plugin, name, write) {
      var template = _(lessTemplate);
      var source = cache[name];
      var output = template
        .replace(/\{\{file\}\}/g, name)
        .replace("{{function}}", source);
      write(output);
    }
  };

});