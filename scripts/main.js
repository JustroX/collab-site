
var app = angular.module("site", ["ngRoute","hljs","ngSanitize","ngAnimate","checklist-model"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/pages/static/welcome",
    })


    
    //static
    .when("/welcome", {
        templateUrl : "/pages/static/welcome"
    })
    .when("/dashboard", {
        templateUrl : "/pages/static/dashboard"
    })
    .when("/invitation/:id", {
        templateUrl : "/pages/static/invitation"
    })


    //User
    .when("/user/new", {
        templateUrl : "/pages/user/new"
    })
    // .when("/user", {
    //     templateUrl : "/pages/user/list"
    // })
    .when("/user/edit/", {
        templateUrl : "/pages/user/edit"
    })
    .when("/user/:id", {
        templateUrl : "/pages/user/view"
    })


    //Guild
    // .when("/guild/new", {
    //     templateUrl : "/pages/guild/new"
    // })
    .when("/guild", {
        templateUrl : "/pages/guild/list"
    })
    .when("/guild/:id", {
        templateUrl : "/pages/guild/view"
    })
    .when("/guild/edit/:id", {
        templateUrl : "/pages/guild/edit"
    })

    
    //Post    
    .when("/post/new", {
        templateUrl : "/pages/post/new"
    })
    // .when("/post", {
    //     templateUrl : "/pages/post/list"
    // })
    .when("/post/:id", {
        templateUrl : "/pages/post/view"
    })
    .when("/post/edit/:id", {
        templateUrl : "/pages/post/edit"
    })


    
    //Module
    .when("/guild/:guild/module/new", {
        templateUrl : "/pages/module/new"
    })
    .when("/guild/:guild/module", {
        templateUrl : "/pages/module/list"
    })
    .when("/guild/:guild/module/:id", {
        templateUrl : "/pages/module/view"
    })
    .when("/guild/:guild/module/:id/edit", {
        templateUrl : "/pages/module/edit"
    })
    
    //---for challenges  / articles
    .when("/module/:id/:page", {
        templateUrl : "/pages/module/view"
    })
    


    
    //Badge    
    .when("/badge/new", {
        templateUrl : "/pages/badge/new"
    })
    .when("/badge", {
        templateUrl : "/pages/badge/list"
    })
    .when("/badge/:id", {
        templateUrl : "/pages/badge/view"
    })
    .when("/badge/edit/:id", {
        templateUrl : "/pages/badge/edit"
    })

    
    //Articles    
    .when("/article/new", {
        templateUrl : "/pages/article/new"
    })
    .when("/article", {
        templateUrl : "/pages/article/list"
    })
    .when("/article/:id", {
        templateUrl : "/pages/article/view"
    })
    .when("/article/edit/:id", {
        templateUrl : "/pages/article/edit"
    })

    
    //Challenges

    .when("/challenge/new", {
        templateUrl : "/pages/challenge/new"
    })
    .when("/challenge", {
        templateUrl : "/pages/challenge/list"
    })
    .when("/challenge/:id", {
        templateUrl : "/pages/challenge/view"
    })
    .when("/challenge/edit/:id", {
        templateUrl : "/pages/challenge/edit"
    })

    
    //Submissions

    .when("/submission/new", {
        templateUrl : "/pages/submission/new"
    })
    .when("/submission", {
        templateUrl : "/pages/submission/list"
    })
    .when("/submission/:id", {
        templateUrl : "/pages/submission/view"
    })
    .when("/submission/edit/:id", {
        templateUrl : "/pages/submission/edit"
    })

    .when("/static/:location", {
        templateUrl : "/pages/static/static"
    })

    .otherwise({
        redirectTo: '/dashboard'
    })
});


// var quill ;
