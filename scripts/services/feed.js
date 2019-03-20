app.service('feedService', function($http,$timeout) 
{
	class Post
	{
		constructor()
		{
			this.id = Math.random().toString(36).substring(7);

		}
	}

	class Feed
	{
		constructor()
		{
			this.id = Math.random().toString(36).substring(7);

		}	
	}


	class Editor
	{
		constructor()
		{
			this.id = Math.random().toString(36).substring(7);

		}
	}

	class SmartFeed
	{
		constructor(config)
		{
			this.id = Math.random().toString(36).substring(7);
			for(let  i in config)
				this[i] = config[i];

			this.events = {};


			this.feeds = {};
			this.posts = {};
			this.editors = {};
			
		}

		newFeed()
		{

			let a = new Feed();
			this.feeds[a.id] = a; 
			return a;
		}
		newPost()
		{
			let a  =new Post();
			this.posts[a.id]  =a;
			return a;
		}
		newEditor()
		{
			let a = new Editor();
			this.editors = {};
			return a;
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


