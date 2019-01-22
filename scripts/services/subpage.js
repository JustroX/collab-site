app.service('subpageService', function(session,$http,$timeout,$rootScope) 
{
	class Subpage
	{
		constructor()
		{
			this.page = [];
			this.onloadObj = {};
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

		goto(location,param)
		{
			let _page = this;
			$timeout(function()
			{
				_page.page = location.split("/")
				if(_page.onloadObj[location.split("/").join("/")])
					_page.onloadObj[location.split("/").join("/")](param);
			},1);
		}

		onload(location,f_)
		{
			this.onloadObj[location.split("/").join("/")] = f_;
		}

	}

	this.Page = function()
	{
		return new Subpage();
	}
});


