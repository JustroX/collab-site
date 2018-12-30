app.controller("pagePostListController",function($scope,$http,$location,$timeout)
{
	$scope.parent_api =
	{
		post:
		{
			list: 
			{
				ready: function(_api)
				{
					_api.param = "sort=-date";
					_api.load();
				}
			}
		}
	}
});