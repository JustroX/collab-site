app.controller("postNewController",function($scope,$http,$location,$timeout,apiService,editorService,$rootScope)
{
	let model = 
	{
		content: '',
		group: "5c226f60a51750466819b85f",
	};

	$scope.model   = model;

	let editor = editorService.create($scope);
	editor.textchange = function()
	{
		$scope.model.content = JSON.stringify(editor.quill.getContents());
	}

	let api = apiService.new("post",$scope);
	api.loaded = function(res)
	{
		editor.quill.setText('');
		$scope.model.content = '';
		$scope.model.title = '';
	}
	api.success = function(res)
	{
		$scope.editor.toggle();
		UIkit.notification({
		    message: 'Your post has been published!',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});

		$rootScope.$broadcast('components/post/new/success');

	}
	api.validate = function()
	{
		return $scope.model.content !='' && $scope.model.group!='';
	};

	$scope.$on('components/post/new/group',function(ev,data)
	{
		$scope.model.group = data.group;
	});

	$scope.$on('components/post/new/post',function(ev,data)
	{
		$scope.model.group = data.group || $scope.model.group;
		$scope.model.parent  = data.parent; 
	});

	$scope.init = function()
	{
		$timeout(function()
		{
			$scope.editor.init('text-editor'+$scope.unique_id);
			$scope.editor.active= false;
		},2);
	}

	$scope.editor = editor;
	$scope.api    = api;

	// $timeout(editor.init , 1);
});