/**
 * User: mengekys
 * Date: 16-3-12
 * File: Oauth
 */

https://open.weixin.qq.com/connect/qrconnect?appid=wx6b26b7c75e8f3e5a&redirect_uri=http%3A%2F%2Fwww.imooc.com%2Fpassport%2Fuser%2Ftpcallback%3Freferer%3Dhttp%3A%2F%2Fwww.imooc.com%26tp%3Dweixin%26bind%3D0&response_type=code&scope=snsapi_login#wechat_redirect

// dependent modules
    const url       = require('url');
const client    = require('request');
const urlencode = require('urlencode');

// build object for oauth.
// redirect must use urlencode deal
var Oauth = function (options) {
    if(!options){
        throw new Error('oauth config required.');
    }
    // appid must.
    if(!options.appid){
        throw new Error('appid required.');
    }

    // secret must.
    if(!options.secret){
        throw new Error('secret required.');
    }

    this.appid        = options.appid;
    this.secret       = options.secret;
    this.state        = options.state || 'a-zA-Z0-9';
};

function makeUrl(options){
    return url.format(options);
}

function clientRequest(url, callback){
    client(url, function (error, response, body) {
        if(error) return callback(error);
        if(response.statusCode == 200){
            return callback(null, body);
        } else {
            return callback(new Error(response.statusCode));
        }
    });
}
// build the url for authorization.
Oauth.prototype.getAuthUrl = function (redirect, scope) {
    var authUrl =  {
        protocol:'https',
        host:"open.weixin.qq.com",
        path:"/connect/oauth2/authorize",
        query:{
            appid: this.appid,
            redirect_uri: urlencode(redirect),
            response_type: 'code',
            scope: scope,
            state: this.state || 'a-zA-Z0-9'
        },
        hash:"wechat_redirect"
    };
    return makeUrl(authUrl);
};

// build the url for third website qrcodr authorization url.
Oauth.prototype.getQRCodeAuthUrl = function (redirect_uri) {
    var qrcodeUrl = {
        protocol:'https',
        host:'open.weixin.qq.com',
        path:'/connect/qrconnect',
        query: {
            appid: this.appid,
            redirect_uri: redirect_uri,
            response_type:'code',
            scope:'snsapi_login'
        },
        hash:'wechat_redirect'
    };

    return makeUrl(qrcodeUrl);
};

// get access_token and openid
Oauth.prototype.getAccessToken = function (code, callback) {
    var accessTokenUrl = makeUrl({
        protocol:'https',
        host:'api.weixin.qq.com',
        path:'/sns/oauth2/access_token',
        query:{
            appid: this.appid,
            secret: this.secret,
            code: code,
            grant_type:"authorization_code"
        }
    });
    clientRequest(accessTokenUrl, callback);
};


// get user information by openid & access_token.
Oauth.prototype.getUserInfo = function (options, callback) {
    if(!options || !options.openid || !options.access_token || Function.isFunction(options) ){
        throw new Error('access_token, openid required.');
    }

    const userInfoUrl = makeUrl({
        protocol:'https',
        host:'api.weixin.qq.com',
        path:'/sns/userinfo',
        query:{
            access_token:options.access_token,
            openid: options.openid,
            lang:options.lang || 'zh-CN'
        }
    });
    clientRequest(userInfoUrl, callback);
};


// auto refresh access_token
Oauth.prototype.refreshToken = function (refresh_token,callback) {
    const tokenUrl = makeUrl({
        protocol:'https',
        host:'api.weixin.qq.com',
        path:'/sns/oauth2/refresh_token',
        query:{
            openid: this.openid,
            grant_type: 'refresh_token',
            refresh_token:refresh_token
        }
    });
    clientRequest(tokenUrl, callback);
};


// verify access_token effective
Oauth.prototype.verifyToken = function (access_token,openid,callback) {
    var verifyUrl = makeUrl({
        protocol:'https',
        host:'api.weixin.qq.com',
        path:'/sns/auth',
        query:{
            access_token:access_token,
            openid: openid
        }
    });
    clientRequest(verifyUrl, callback);
};

module.exports = function (options) {
    return new Oauth(options)
};
