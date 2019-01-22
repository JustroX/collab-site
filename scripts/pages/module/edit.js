app.controller("pageModuleEditController",function($scope,$http,$location,$timeout,$routeParams,subpageService,editorService)
{
	$scope.guild_id = $routeParams.guild;
	$scope.module_id = $routeParams.id;

	$scope.subpage = subpageService.Page();


	$timeout(function()
	{
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id});
		$scope.$broadcast('components/article/new/init',{_id:$routeParams.id});
	},4);

	$scope.delete_module = function()
	{
		$timeout(function()
		{
			UIkit.modal('#modal-module-delete').show();
			$scope.$broadcast('component/module/delete/init',{ target: $routeParams.id });
		},3);
	}

	$scope.delete_article = function(article)
	{
		$timeout(function()
		{
			UIkit.modal('#modal-article-delete').show();
			$scope.$broadcast('component/article/delete/init',{ target: article._id });
		},3);
	}

	$scope.edit_article = function(article)
	{
		$scope.subpage.goto("article",{_id:article._id});
	}

	$scope.subpage.onload("article",function(param)
	{
		$scope.$broadcast('components/article/edit/init',{target : param._id });
	});

	$scope.save_changes = function()
	{
		$scope.$broadcast('components/article/edit/submit');
	}

	$scope.show_testcases = function()
	{
		UIkit.modal('#modal-challenge-testcases').show();
	}
	$scope.edit_title = function()
	{
		UIkit.modal('#modal-module-title').show();
		$timeout(function()
		{
			$scope.$broadcast('component/module/edit/init',{ target: $routeParams.id  });
		},3);
	}

	$scope.edit_badges = function()
	{
		UIkit.modal('#modal-module-badge').show();
	}
	$scope.badge_forge = function()
	{
		UIkit.modal('#modal-badge-forge').show();
	}

	$scope.$on('component/module/delete/success',function(ev,data)
	{
		UIkit.modal('#modal-module-delete').hide();
		UIkit.notification({
		    message: 'Module has been deleted',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
		$timeout(function()
		{
			window.location.href = '#/guild/'+$routeParams.guild;
		},100);
	});

	$scope.$on('component/article/delete/success',function(ev,data)
	{
		UIkit.modal('#modal-article-delete').hide();
		UIkit.notification({
		    message: 'Article has been deleted',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id});
	});

	$scope.$on('component/module/edit/success',function(ev,data)
	{
		UIkit.modal('#modal-module-title').hide();
		UIkit.notification({
		    message: 'Module has been updated',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
	});

	$scope.$on('components/article/new/success',function(ev,data)
	{
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id});
	});
	$scope.$on('components/article/edit/success',function(ev,data){
		UIkit.notification({
		    message: 'Article has been updated',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id});
	});
	$scope.$on('components/module/order/success',function(ev,data)
	{
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id, silent: true});
	});

});