# node-wechat-oauth

[Wechat Official Document](http://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842&token=&lang=zh_CN)
[Repository Address](https://github.com/yuncreate/node-wechat-oauth.git)

## Install Module

```javascript
 npm install node-wechat-oauth --save
```

## Usage

### instantiation object. 
```javascript
const  oauth = require('node-wechat-oauth');
const  client = oauth({
   openid:'',
   secret:''
});
```

### Get Authorization Url

#### SNSAPI_BASE

```javascript
client.getAuthUrl(redirect, 'snsapi_base');
```

#### SNSAPI_USERIFO

```javascript
client.getAuthUrl(redirect, 'snsapi_userinfo');
```
##### please make http request redirect to the authorization url ;

#### SNSAPI_LOGIN

```javascript
client.getQRCodeAuthUrl(redirect);
```

### Get AccessToken

```javascript
getAccessToken(code, function(error, result){
    console.log(error || result);
});
```

#### The result of access token request.
```javascript
result:
{ 
     "access_token":"ACCESS_TOKEN",    
     "expires_in":7200,    
     "refresh_token":"REFRESH_TOKEN",    
     "openid":"OPENID",    
     "scope":"SCOPE" 
 } 
```

### Get User Information

```javascript
client.getUserInfo({
  access_token: 'ACCESS_TOKEN',
  openid: 'OPENID'
}，function(error, result){
    console.log(error || result);
});
```

#### User information details
```javascript
{    
    "openid":" OPENID",  
    "nickname": NICKNAME,   
    "sex":"1",   
    "province":"PROVINCE"   
    "city":"CITY",   
    "country":"COUNTRY",    
    "headimgurl":    "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",  
    "privilege":[ "PRIVILEGE1" "PRIVILEGE2"     ],    
    "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL" 
} 
```

### Refresh AccessToken

```javascript
client.refreshToken(access_token, function(error, result){
    console.log(error, result);
});
```

### Verify AccessToken
```javascript
client.verifyToken(access_token,openid,function(error, result){
    console.log(error || result);
});
```
#### result of verify
```javascript
valid
{ 
    "errcode":0,
    "errmsg":"ok"
}
invalid
{
    "errcode":40003,
    "errmsg":"invalid openid"
}
```

