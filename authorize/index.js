/**
* Get the value of a querystring
* @param  {String} field The field to get the value of
* @param  {String} url   The URL to get the value from (optional)
* @return {String}       The field value
*/
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

var account_linking_token = getQueryString('account_linking_token');
var redirect_uri = decodeURIComponent(getQueryString('redirect_uri'));
var authorization_code = "86be3863-c442-42b4-bbb4-8c8945c05077";

window.location.href = `${redirect_uri}&authorization_code=${authorization_code}`;