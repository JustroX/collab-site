app.controller("articleEditController",function($scope,$http,$location,$timeout,session,apiService,editorService)
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
	$scope.editor = editor;

	let api = apiService.edit("article",$scope);
	api.loaded = function(res)
	{
		editor.quill.setText('');
		model.content = '';
		model.title = '';
	}
	api.validate = function()
	{
		return model.content !='' && model.title!='';
	};	

	let view = apiService.view("article",$scope);
	view.success= function(res)
	{
		view.value = res;
		$scope.model = res;
		$scope.editor.quill.setContents(JSON.parse(res.content));
	}

	api.view =  view;

	$scope.api = api;



});