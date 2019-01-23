app.controller("challengeNewController",function($scope,$http,$location,$timeout,apiService,editorService,$rootScope)
{
	let model = 
	{
		title: "New Challenge",
		content:"",
		module: null,
	}
	$scope.model   = model;
	
	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}

	let api = apiService.new("challenge",$scope);
	
	api.validate = function()
	{
		return $scope.model.title!="" && $scope.model.module!="";
	};

	$scope.editor = editor;
	$scope.api    = api;

	$scope.$on('components/challenge/new/init',function(ev,data)
	{
		$scope.model.title = "New Challenge";
		$scope.model.module = data._id; 
	});

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/challenge/new/success');
	}


});