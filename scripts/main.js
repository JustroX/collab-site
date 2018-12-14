
var app = angular.module("site", ["ngRoute","hljs"]);


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
    .when("/guild/:id", {
        templateUrl : "/pages/guild/main"
    })
    .when("/profile", {
        templateUrl : "/pages/profile"
    })
    .when("/register", {
        templateUrl : "/pages/register"
    })
    .when("/module/:id/edit", {
        templateUrl : "/pages/module/editor"
    })
    .when("/module/:id/", {
        templateUrl : "/pages/module/viewer"
    }).
    otherwise({
        redirectTo: '/dashboard'
    })
});


var quill ;
