import { resolvePath, hashChange } from '../utils'

function HashHistory(option) {
  this.onChange = option.onChange;
}

HashHistory.prototype.start = function() {
  var self = this;
  this.listener = function () {
    var path = location.hash;
    var raw = path.replace(/^#!/, '');
    if (raw.charAt(0) !== '/') {
      raw = '/' + raw;
    }
    var formattedPath = self.formatPath(raw);
    if (formattedPath !== path) {
      location.replace(formattedPath);
      return;
    }
    self.onChange(decodeURI(path.replace(/^#!/, '')));
  };
  hashChange.bind(this.listener);
  this.listener();
};

HashHistory.prototype.stop = function() {
  hashChange.remove(this.listener);
};

HashHistory.prototype.go = function(path, replace) {
  var location = window.location;
  path = this.formatPath(path);
  location.hash = path;
};

HashHistory.prototype.formatPath = function(path) {
  var prefix = '#!';
  var start = path.charAt(0);
  return start === '/'
    ? prefix + path
    : start === '#'
      ? prefix + location.hash.replace(/^#!/, '').replace(/#.*/g, '') + path
      : prefix + resolvePath(location.hash.replace(/^#!/, '').replace(/#.*/g, ''), path);
};

export default HashHistory
