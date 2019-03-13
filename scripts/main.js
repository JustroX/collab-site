
var app = angular.module("site", ["ngRoute","ngSanitize","checklist-model"]);


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
    .when("/module/:id/view/:page", {
        templateUrl : "/page/moduleView",
    })
    .when("/module/:id/view/", {
        redirectTo: '/module/:id/view/0',  
    })
    .when("/profile/:id/", {
        templateUrl : "/page/profile",
    })
    .when("/invitation/:id", {
        templateUrl : "/page/invitation",
    })
    .when("/static/:location", {
        templateUrl : "/page/static",
    })
    .when("/badge/", {
        templateUrl : "/page/badge",
    })
    .when("/404", {
        templateUrl : "/page/404",
    })
    .otherwise({
        redirectTo: '/404',
    })
});


// var quill ;
