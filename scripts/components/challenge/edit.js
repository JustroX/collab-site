app.controller("challengeEditController",function($scope,$http,$location,$timeout,apiService,editorService,$rootScope)
{
	let model = 
	{
		title: "",
		content: "",
		module: "",
		output_type: 0,
	}
	let initialized = false;
	$scope.model = model;

	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}
	$scope.editor = editor;

	let api = apiService.edit("challenge",$scope);

	api.validate = function()
	{
		return $scope.model.title!="" && $scope.model.content!="" && $scope.model.module!="" ;	
	};	

	$scope.api = api;
	let view = apiService.view("challenge",$scope);
	api.view =  view;
	view.success= function(res)
	{
		view.value = res;
		$scope.model = res;
		$scope.model.output_type += '';
		$scope.editor.quill.setContents(JSON.parse(res.content || '{"ops":[{"attributes":{"header":1},"insert":"\\n"}]}'));
	}



	$scope.api.success = function()
	{
		$rootScope.$broadcast('components/challenge/edit/success',{});
	}



	$scope.$on('components/challenge/edit/init',function(ev,data)
	{
		if(!initialized)
			$scope.editor.init('challenge-editor');
		$scope.api.view.target = data.target;
		$scope.api.view.load();
		$scope.api.error = "";
		initialized = true;
	});


	$scope.$on('components/challenge/edit/submit',function(ev,data)
	{
		$scope.api.submit();
	});

});