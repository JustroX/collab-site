app.controller("pageBadgeViewController",function($scope,$http,$location,$timeout)
{
	$scope.$on('page/badge/view/init',function(ev,data)
	{
		$scope.$broadcast('components/badge/list/init',{param:'sort=-date'});
	});

	$scope.$on('components/badge/new/success',function(ev,data){
		$scope.$broadcast('components/badge/list/init',{param:'sort=-date'});
	});

	$scope.$on('components/badge/edit/success',function(ev,data){
		UIkit.notification({
		    message: 'Badge has been modified',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
		$scope.$broadcast('components/badge/list/init',{param:'sort=-date'});
	});

	$scope.$on('components/badge/delete/success',function(ev,data)
	{
		UIkit.notification({
		    message: 'Badge has been deleted',
		    status: 'success',
		    pos: 'top',
		    timeout: 3000
		});
		$scope.$broadcast('components/badge/list/init',{param:'sort=-date'});
		$scope.$broadcast('components/badge/edit/hide');
	});


	$scope.edit_badge = function(badge)
	{
		$scope.$broadcast('components/badge/edit/init',{ _id: badge._id  });
		$scope.$broadcast('components/badge/delete/init',{ _id: badge._id  });
	}
});