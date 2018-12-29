app.controller("postEditController",function($scope,$http,$location,$timeout,session,apiService)
{
	let model = { content: '', group: '5c226f60a51750466819b85f'}; //Dummy id
	$scope.model = model;

	let api = apiService.edit("post",$scope);
	let view = apiService.view("post",$scope);
	
	api.loaded = function(res)
	{
		model  = { content: '', group: '5c226f60a51750466819b85f'};
		$scope.model = model;
	};
	api.validate = function()
	{
		return $scope.model.group !=""&& $scope.model.content !="" ;
	};
	
	api.view =  view;
	$scope.api = api;
});