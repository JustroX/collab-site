app.controller("postListController",function($scope,$http,$location,$timeout,session,apiService,editorService)
{
	let api = apiService.list("post",$scope);
	api.success = function(res)
	{
		for(let i in res)
		{
			res[i].content = editorService.toHTML(JSON.parse(res[i].content));
		}
		api.list = res;
		$timeout(function()
		{
		   $('pre.ql-syntax').each(function(i, e) {hljs.highlightBlock(e)});
		},1);
	}
	$scope.api    = api;
});