app.controller("challengeNewController",function($scope,$http,$location,$timeout,apiService,editorService)
{
	let model = 
	{
		title: "",
		content:"",
		module: "",
	}
	$scope.model   = model;
	
	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}

	let api = apiService.new("challenge",$scope);
	api.loaded = function(res)
	{
		editor.quill.setText('');
		model.content = '';
		model.title = '';
	}
	api.validate = function()
	{
		return $scope.model.title!="" && $scope.model.content!="" && $scope.model.module!="";
	};

	$scope.editor = editor;
	$scope.api    = api;
});