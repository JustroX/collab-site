app.controller("postFeedController",function($scope,$http,$location,$timeout,session,apiService,editorService)
{
	$scope.api = apiService.list("post",$scope);
	$scope.api.success = function(res)
	{
		for(let i in res)
		{
			try
			{
				res[i].content = editorService.toHTML(JSON.parse(res[i].content));
			}
			catch(err)
			{
				console.log("Parsing error");
			}
		}
		$timeout(function()
		{
			$scope.api.list = $scope.api.list.concat(res);
			$timeout(function()
			{
			   $('pre.ql-syntax').each(function(i, e) {hljs.highlightBlock(e)});
			},1);
		},1);
	}
	 

	$scope.$on('components/post/feed/init',function(ev,data)
	{
		$scope.api.param = data.param;
		$scope.api.list = [];
		$scope.api.page = 0;
		$scope.api.load();
	});
});