app.controller("articleNewController",function($scope,$http,$location,$timeout,apiService,editorService,$rootScope)
{
	let model = 
	{
		title: '',
		content: '',
		module: null,
		authors: [],
	};
	$scope.model   = model;

	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}

	let api = apiService.new("article",$scope);

	api.validate = function()
	{
		return $scope.model.title!='' && $scope.model.module;
	};

	$scope.editor = editor;
	$scope.api    = api;

	$scope.$on('components/article/new/init',function(ev,data)
	{
		$scope.model.title = "New Article";
		$scope.model.module = data._id; 
	});

	$scope.api.success = function(res)
	{
		$rootScope.$broadcast('components/article/new/success');
	}


	// $timeout(editor.init , 1);
});