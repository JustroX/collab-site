app.controller("articleNewController",function($scope,$http,$location,$timeout,apiService,editorService)
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
	api.loaded = function(res)
	{
		editor.quill.setText('');
		model.content = '';
		model.title = '';
	}
	api.validate = function()
	{
		return $scope.model.content !='' && $scope.model.title!='';
	};

	$scope.editor = editor;
	$scope.api    = api;

	// $timeout(editor.init , 1);
});