app.controller("badgeEditController",function( apiService, $scope,$http,$location,$timeout,session,$rootScope)
{
	let model = 
	{
		name: "", 
	};
	$scope.model = model;

	let api = apiService.edit("badge",$scope);
	let view = apiService.view("badge",$scope);
	
	api.validate = function()
	{
		return $scope.model.name!="" ;
	};
	
	api.view =  view;
	$scope.api = api;


	$scope.api.success = function()
	{
		$rootScope.$broadcast('components/badge/edit/success');
	}
	$scope.$on('components/badge/edit/init',function(ev,data)
	{
		$scope.api.view.target = data._id;
		$scope.api.view.load();
	});
	$scope.$on('components/badge/edit/hide',function(ev,data)
	{
		$scope.api.view.target = "";
	});
});