var app = angular.module("site", ["ngRoute"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/pages/welcome",
    })
    .when("/welcome", {
        templateUrl : "/pages/welcome"
    })
});