
var app = angular.module("site", ["ngRoute"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/page/landing",
    })
    .when("/master", {
        templateUrl : "/master/dashboard",
    })
    .when("/dashboard", {
        templateUrl : "/page/dashboard",
    })
    .otherwise({
        redirectTo: '/404'
    })
});


// var quill ;
