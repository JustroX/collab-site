var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/goToBinding", {
        templateUrl : "../Binding/index.html"
    })
    .when("/goToAJAX", {
        templateUrl : "../AJAX/index.html"
    })
});