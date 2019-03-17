app.service('ukAnimate', function($http,$timeout) 
{
	this.play = function(id,reverse,cb=()=>{;})
	{
		$component = $(id);
		if(!reverse)
		{
			$component.fadeIn(500);
			$timeout(cb,500);
		}
		else
		{
			$component.fadeOut(500);
			$timeout(cb,500);
		}
	}
});


