app.controller("postListController",function($scope,$http,$location,$timeout,session,apiService,editorService)
{
	let api = apiService.list("post",$scope);
	api.success = function(res)
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
		api.list = res;
		$timeout(function()
		{
		   $('pre.ql-syntax').each(function(i, e) {hljs.highlightBlock(e)});
		},1);
	}
	$scope.api    = api;

	$scope.$on('components/post/list',function(ev,data)
	{
		$scope.api.param = data.param;
		$scope.api.load();
	});
});