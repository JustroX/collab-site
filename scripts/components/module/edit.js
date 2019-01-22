app.controller("moduleEditController",function($scope,$http,$location,$timeout,session,apiService,subpageService,$rootScope)
{
	let id ;
	let model = 
	{
		name: "", 
		guild: "",
	 };
	$scope.model = model;

	let api = apiService.edit("module",$scope);
	let view = apiService.view("module",$scope);
	$scope.api = api;
	$scope.api.view =  view;

	$scope.subpage = subpageService.Page();
	$scope.current_content = null;

	$scope.api.validate = function()
	{
		return $scope.model.name!="" && $scope.model.guild!="" ;
	};

	$scope.api.success = function()
	{
		$rootScope.$broadcast('component/module/edit/success');
	}

	$scope.$on('component/module/edit/init',function(ev,data)
	{
		id = data.target;
		$scope.api.error = "";
		$scope.api.view.target = data.target;
		$scope.api.view.load();
	});	
	

});