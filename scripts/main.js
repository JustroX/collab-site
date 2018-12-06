
var app = angular.module("site", ["ngRoute"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/pages/welcome",
    })
    .when("/welcome", {
        templateUrl : "/pages/welcome"
    })
    .when("/dashboard", {
        templateUrl : "/pages/dashboard"
    })
    .when("/guild", {
        templateUrl : "/pages/guild"
    })
    .when("/profile", {
        templateUrl : "/pages/profile"
    })
    .when("/register", {
        templateUrl : "/pages/register"
    })
});


var quill , hljs;