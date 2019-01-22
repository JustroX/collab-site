app.controller("moduleNewController",function($scope,$http,$location,$timeout,session,apiService,$rootScope)
{
	let model = 
	{
		name: "", 
		guild: "",
	 };
	$scope.model   = model;
	
	let api = apiService.new("module",$scope);
	api.validate = function()
	{
		return $scope.model.name!="" && $scope.model.guild!="" ;
	};

	$scope.api    = api;

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/module/add/success');
	};

	$scope.$on('components/module/add/init',function(ev,data)
	{
		$scope.api.error = "";
		$scope.model.guild = data._id;
	});
	
});