
//
//`BAWAL MANGOPYA SKL`
//



var app = angular.module("site",["ngRoute"]);


app.config( ($routeProvider) => {
	$routeProvider
			.when("/",{
		templateUrl: "home.html"
	})
	.when("/binding",{
		templateUrl: "binding.html"
	})
	.when("/ajax",{
		templateUrl: "ajax.html"
	});
} );


app.controller("binding",function($scope)
{
	$scope.form = {};
});
app.controller("ajax",function($scope,$http)
{
	$scope.result = [];
	$scope.form = { name: '', password:''};

	$scope.post = function()
	{
		$http.post('/angular-tutorial-1/names',{ form: $scope.form}).then(function(res)
		{
			res = res.data;
			if(res.err) return console.log("Error occured");

			$scope.form.name = "";
			$scope.form.password = "";
		});
	};

	$scope.fetch = function()
	{

		$http.get('/angular-tutorial-1/names').then(function(res)
		{
			res = res.data;
			$scope.result = res;
		});
	}

});