//define/require shim
(function() {

  //don't override existing module loader
  if (typeof define == "function") return;

  var moduleCache = {};

  //returns an array, so not like real path.join()
  var join = function() {
    var path = arguments[0].split("/");
    for (var i = 1; i < arguments.length; i++) {
      path.push.apply(path, arguments[i].split("/"));
    }
    return path;
  }

  var resolve = function(name, path) {
    var cwd = name.replace(/\/[^\/]+$/, "");
    var plugin = "";
    var reducePath = function(dirs, segment) {
      if (segment == ".") return dirs;
      if (segment == "..") {
        dirs.pop();
      } else {
        dirs.push(segment);
      }
      return dirs;
    };
    if (path.indexOf("!") > -1) {
      //extract plugin path
      plugin = join(cwd, path.replace(/!.*$/, "!")).reduce(reducePath, []).join("/");
      path = path.replace(/^[^!]+!/, "");
    }

    var resolved = join(cwd, path).reduce(reducePath, []).join("/");
    return plugin + resolved;
  };

  //runs dependencies at definition time instead of lazy-executing them when required
  //this is probably not technically correct behavior, but works for our purposes
  window.define = function(moduleName, required, def) {
    if (!(required instanceof Array)) {
      def = required;
      required = [];
    }

    var module;
    if (typeof def == "function") {
      var dependencies = required.map(function(path) { return moduleCache[resolve(moduleName, path)] });
      module = def.apply(null, dependencies);
    } else {
      module = def;
    }
    moduleCache[moduleName] = module;
  };

  window.require = function(required, f) {
    if (!f) return;
    var dependencies = required.map(function(path) { return moduleCache[path] });
    f.apply(null, dependencies);
  };

})();