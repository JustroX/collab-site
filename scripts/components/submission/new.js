app.controller("submissionNewController",function($scope,$http,$location,$timeout,apiService,codeService)
{
	let model = 
	{
		content : "",
	   	challenge: "",
	};

	$scope.model   = model;

	let editor = codeService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.codemirror.getValue());
	}

	let api = apiService.new("submission",$scope);
	api.loaded = function(res)
	{
		editor.codemirror.setValue('');
		model.content = '';
	}
	api.validate = function()
	{
		return $scope.model.content !='' && $scope.model.challenge!='';
	};

	$scope.editor = editor;
	$scope.api    = api;

});