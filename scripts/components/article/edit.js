app.controller("articleEditController",function($scope,$http,$location,$timeout,session,apiService,editorService,$rootScope)
{
	let model = 
	{
		title: '',
		content: '',
		module: null,
		authors: [],
	};
	let initialized = false;
	$scope.model   = model;

	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}
	$scope.editor = editor;

	let api = apiService.edit("article",$scope);
	
	api.validate = function()
	{
		return $scope.model.content !='' && $scope.model.title!='';
	};	

	$scope.api = api;
	let view = apiService.view("article",$scope);
	api.view =  view;
	view.success= function(res)
	{
		view.value = res;
		$scope.model = res;
		$scope.editor.quill.setContents(JSON.parse(res.content || '{"ops":[{"attributes":{"header":1},"insert":"\\n"}]}'));

	}

	$scope.api.success = function()
	{
		$rootScope.$broadcast('components/article/edit/success',{});
	}



	$scope.$on('components/article/edit/init',function(ev,data)
	{
		if(!initialized)
			$scope.editor.init('text-editor');
		$scope.api.view.target = data.target;
		$scope.api.view.load();
		$scope.api.error = "";
		initialized = true;
	});


	$scope.$on('components/article/edit/submit',function(ev,data)
	{
		$scope.api.submit();
	});



});