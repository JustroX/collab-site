app.controller("moduleOrderController",function($scope,$http,$location,$timeout,apiService,editorService,$rootScope)
{
	let model = 
	{
		inc: 0,
		page: 0,
	};
	$scope.model   = model;

	let api = apiService.new("module",$scope);
	$scope.api    = api;
	$scope.api.url = 'module/'+ $scope.module_id + '/page'; 


	api.validate = function()
	{
		return $scope.model.page!=null && $scope.model.inc;
	};


	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/module/order/success');
	}


	// $timeout(editor.init , 1);
});