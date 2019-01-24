app.controller("pageModuleViewController",function($scope,$http,$location,$timeout,apiService,$routeParams,subpageService)
{
	let page =  0;
	$scope.page  = page;
	document.body.style.backgroundColor = "white";
	$scope.guild_id = $routeParams.guild;
	$scope.module_id = $routeParams.id;

	$scope.language_codes = 
	{
		"python2" : "Python 2",
		"python3" : "Python 3",
		"cpp" : "C++",
		"c" : "C",
	}

	$scope.subpage = subpageService.Page();

	$scope.master = apiService.view("module",$scope);
	$scope.master.target = $scope.module_id;

	$scope.access  = {};

	$scope.access.article = function(article,idx)
	{
		$scope.$broadcast('components/article/view',{_id: article._id});
		$scope.page = idx;
		$scope.subpage.goto('article');
	}
	$scope.access.challenge = function(challenge,idx)
	{
		$scope.$broadcast('components/challenge/view',{_id: challenge._id});
		$scope.page = idx;
		$scope.subpage.goto('challenge');

	}

	let first_time  = true;
	$scope.$on('components/module/page/list/success',function(ev,data)
	{
		if(first_time)
		{
			$scope.access[data.list[0].mode](data.list[0][data.list[0].mode],0);
			$scope.pages = data.list;
			first_time = false;
		}
	});

	$scope.$on('components/submission/new/success',function(ev,data)
	{
		UIkit.modal('#modal-submission-confirm').hide();
	});

	$scope.init_codebox = function()
	{
	}

	$scope.page_prev = function()
	{
		let z = Math.max( $scope.page - 1 , 0 ) ;
		$scope.access[$scope.pages[z].mode]($scope.pages[z][$scope.pages[z].mode],z);
	}
	$scope.page_next = function()
	{
		let z = Math.min( $scope.page + 1 , $scope.pages.length-1 );
		$scope.access[$scope.pages[z].mode]($scope.pages[z][$scope.pages[z].mode],z);
	}

	setTimeout(function()
	{
		$scope.master.load();
		$scope.$broadcast('components/module/page/list',{_id:$routeParams.id});
		$scope.init_codebox();
	},1);

});