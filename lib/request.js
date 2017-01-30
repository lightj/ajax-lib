'use strict';

function optimizeCB(uri, method, opts, cb) {
  if(typeof uri !== 'string') {
    throw new TypeError(`uri must be String: ${uri}`)
  }

  if(typeof cb === 'undefined') {
    if(typeof opts !== 'function') {
      throw new TypeError(`callback must be function: ${opts}`);
    }
    return [uri, {method:method}, opts];
  }
  else if (typeof cb !== 'function') {
    throw new TypeError(`callback must be function: ${cb}`);
  }

  if(typeof opts !== 'object') {
    throw new TypeError(`options muse be object{}: ${opts}`);
  }

  return [uri, opts, cb];
}

function request(uri, opts, cb) {
  const httpRequest = this.httpRequest;
  const isOptions = typeof cb === 'undefined';
  const options = isOptions ? {} : opts;

  if(isOptions) {
    cb = opts;
    options.method = 'GET';
    options.data = {};
  }

  if(typeof module !== 'undefined' && module.exports) {
    // CommonJS
    httpRequest(Object.assign({uri : uri}, options), (err, res, body) => {
      if(err) {
        cb(err, res);
      }
      cb(null, res);
    });
  }
  else {
    // Browser
    httpRequest.open(options.method, uri, true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.send(JSON.stringify(options.data));
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState == httpRequest.DONE ) {
        if(httpRequest.status === 200) {
          cb(null, httpRequest.responseText)
        }
        else {
          cb(httpRequest.status, httpRequest.responseText)
        }
      }
    }
  }
}

function get(uri, opts, cb) {
  request.apply(this, optimizeCB(uri, 'GET', opts, cb));
}

function post(uri, opts, cb) {
  request.apply(this, optimizeCB(uri, 'POST', opts, cb));
}

function put(uri, opts, cb) {
  request.apply(this, optimizeCB(uri, 'PUT', opts, cb));
}

function del(uri, opts, cb) {
  request.apply(this, optimizeCB(uri, 'DELETE', opts, cb));
}

module.exports.request = request;
module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
module.exports.del = del;