app.controller("challengeEditController",function($scope,$http,$location,$timeout,apiService,editorService)
{
	let model = 
	{
		title: "",
		content: "",
		module: "",
		output_type: 0,
	}
	$scope.model = model;

	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}
	$scope.editor = editor;

	let api = apiService.edit("challenge",$scope);
	api.loaded = function(res)
	{
		editor.quill.setText('');
		$scope.model.content = '';
		$scope.model.title = '';
	}
	api.validate = function()
	{
		return $scope.model.title!="" && $scope.model.content!="" && $scope.model.module!="" && $scope.model.output_type;	
	};	
	let view = apiService.view("challenge",$scope);
	view.success= function(res)
	{
		view.value = res;
		$scope.model = res;
		$scope.model.output_type += '';
		$scope.editor.quill.setContents(JSON.parse(res.content));
	}

	api.view =  view;

	$scope.api = api;

});