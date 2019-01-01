app.service('ukAnimate', function($http,$timeout) 
{
	this.play = function(id,animation,cb=()=>{;})
	{
		$component = $(id);
		$component.addClass(animation);
		$component.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function()
		{
			$timeout(function()
			{
				$component.removeClass(animation);
				cb();
			},1);
	    });
	}
});

