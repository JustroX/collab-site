app.service('feedService', function($http,$timeout) 
{
	class Post
	{
		
	}

	class Feed
	{
		
	}


	class Editor
	{

	}

	class SmartFeed
	{
		constructor(config)
		{
			for(let  i in config)
				this[i] = config[i];

			this.events = {};
		}

		on(event,cb)
		{
			this.events[event] = [cb];
		}

		emit(event,...args)
		{
			for(let i in this.events[event])
				this.events[event][i](...args);
		}
	}
});


