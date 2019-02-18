
var app = angular.module("site", ["ngRoute","ngSanitize"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/page/landing",
    })
    .when("/master", {
        templateUrl : "/master/dashboard",
    })
    .when("/dashboard", {
        redirectTo : "/dashboard/feed",
    })
    .when("/dashboard/:subpage", {
        templateUrl : "/page/dashboard",
    })
    .when("/group/:id/", {
        redirectTo: '/group/:id/feed',
    })
    .when("/group/:id/:subpage", {
        templateUrl : "/page/group",
    })
    .when("/module/:id/edit/", {
        templateUrl : "/page/moduleEdit",
    })
    .when("/404", {
        templateUrl : "/page/404",
    })
    .otherwise({
        redirectTo: '/404',
    })
});


// var quill ;
