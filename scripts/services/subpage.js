app.service('subpageService', function(session,$http,$timeout,$rootScope) 
{
	class Subpage
	{
		constructor()
		{
			this.page = [];
		}

		Ispage(str)
		{
			let sp  = str.split("/");
			for(let i in sp)
				if( sp[i] != this.page[i] )
					return false;
			return true;
		}

		here(str)
		{
			return str.split("/").join("/") == this.page.join("/");
		}

		goto(location)
		{
			let _page = this;
			$timeout(function()
			{
				_page.page = location.split("/")
			},1);
		}
	}

	this.Page = function()
	{
		return new Subpage();
	}
});


