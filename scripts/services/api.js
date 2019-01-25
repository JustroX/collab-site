app.service('apiService', function(session,$http,$timeout,$rootScope) 
{
	class deleteAPI
	{
		constructor($scope,target="")
		{
			this.target = ($scope.parent_api && $scope.parent_api.target) || target;
			this.loading = false;
			this.error = "";
			this.$scope = $scope;
			this.succ = "";
		}
		delete()
		{
			let api_ = this;
			this.error ="";
			if(!this.target) return this.error="API: Target not specified";
			this.loading = true;
			$http.delete('/api/'+api_.url+'/'+api_.target).then((res)=>
			{
				res = res.data;
				api_.loading = false;
				api_.target = '';
				if(res.err)
					return api_.err(res.err);
				api_.success(res)
			});
		}
		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}
		success(res)
		{
			this.succ = res;
			if(this.$scope.parent_api)
				this.$scope.parent_api.delete.success(res);
		}
	}

	class newAPI
	{
		constructor($scope,model_name='model')
		{
			this.loading = false;
			this.$scope = $scope;
			this.error = "";
			this.succ = "";
			this.model_name = model_name;
		}
		submit()
		{
			let api_ = this;
			if(!api_.validate())
			{
				api_.error = "Please fill up all necessary information.";
				return;
			}	
			api_.error = '';
			api_.loading = true;
			$http.post('/api/'+api_.url+'',this.$scope[this.model_name]).then((res)=>
			{
				res = res.data;

				api_.loaded(res);

				api_.loading = false;
				if(res.err)
					return api_.err(res.err);

				if(api_.$scope.parent_api)
					api_.$scope.parent_api.new.success(res);
				api_.success(res)
			});
		}
		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}
		loaded(res)
		{
			;
		}
		validate()
		{
			return true;
		}
		success(res)
		{
			;
		}
	}

	class listAPI
	{
		constructor($scope,...args)
		{
			this.loading = false;
			this.error  = false;

			this.limit = 10;
			this.page = 0;
			this.options = null;

			this.list = [];
			this.param = "";
			this.$scope = $scope;

			let _api = this;
			if($scope.parent_api && $scope.parent_api.post && $scope.parent_api.post.list && $scope.parent_api.post.list.ready)
				$timeout(function()
				{
					_api.$scope.parent_api.post.list.ready(_api.$scope.api);
				},1);


		}

		load()
		{
			let api_ = this;
			session.onready(function()
			{
				api_.loading = true;
				console.log('/api/'+api_.url+'?limit='+api_.limit+'&offset='+api_.page+'&'+api_.param);
				$http.get('/api/'+api_.url+'?limit='+api_.limit+'&offset='+api_.page+'&'+api_.param).then((res)=>
				{
					api_.load_options();
					res = res.data;
					api_.loading = false;
					if(res.err)
						return api_.err(res.err);
					api_.success(res);
				});
			});
		}

		load_options()
		{
			let api_ = this;
			$http.get('/api/'+api_.url+'?option=true').then((res)=>
			{
				res = res.data;
				api_.options = res;


				if( api_.page*api_.limit > api_.options.collectionCount )
				{
					api_.page = Math.floor(api_.options.collectionCount/api_.limit ) -1;
				}
				api_.page_max = Math.ceil(api_.options.collectionCount/api_.limit) -1;
			});
		}

		next()
		{
			this.page+=1;
			this.load();
		}

		prev()
		{
			this.page = (this.page <= 0) ? 0 : (this.page - 1);
			this.load();
		}

		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}

		success(res)
		{
			this.list = res;
		}

		init()
		{
			let api_ = this;
			session.onready(function()
			{
				api_.param = '';
				api_.load();
			});
		}
	}


	class viewAPI
	{
		constructor($scope)
		{
			this.loading = false;
			this.error = "";
			this.value =  null;
			this.target = ($scope.parent_api && $scope.parent_api.target) || '';
			this.param = "";
			this.$scope  = $scope;
		}
		load(cb=function(){})
		{
			let api_ = this;
			// session.onready(function()
			// {
			api_.loading = true;
			$http.get('/api/'+api_.url+'/'+api_.target+'?'+api_.param).then((res)=>
			{
				api_.loaded(res);
				api_.load_options();
				res = res.data;
				api_.loading = false;
				if( res.err || res == "" )
					return api_.err(res.err);
				api_.success(res,cb);
			});
			// });
		}
		load_options()
		{
			let api_ = this;
			$http.get('/api/'+api_.url+'?option=true').then((res)=>
			{
				res = res.data;
				api_.options = res;
			});
		}
		loaded()
		{
			;
		}
		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}
		success(res,cb)
		{
			this.value = res;
			this.$scope.model = res;
			cb();
		}
	}

	class editAPI
	{
		constructor($scope,model_name="model")
		{
			this.loading = false;
			this.error = "";
			this.$scope  =$scope;
			this.model_name = model_name;

		}
		submit()
		{
			let api_ = this;
			if(!api_.validate())
			{
				api_.error = "Can't update an empty content.";
				return;
			}	
			api_.error = '';
			api_.loading = true;
			$http.put('/api/'+api_.url+'/'+api_.view.target,this.$scope[this.model_name]).then((res)=>
			{
				res = res.data;
				api_.loaded(res);
				api_.loading = false;
				if(res.err)
					return api_.err(res.err);

				if(this.$scope.parent_api && this.$scope.parent_api.edit && this.$scope.parent_api.edit.success)
					this.$scope.parent_api.edit.success(res);
				api_.success(res)
			});
		}
		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}
		loaded(res)
		{
			;
		}
		validate()
		{
			return true;
		}
		success(res)
		{
		}
	}


	this.delete = function(model,...args)
	{
		let a = new deleteAPI(...args);
		a.url = model;
		return a;
	}
	this.new = function(model,...args)
	{
		let a = new newAPI(...args);
		a.url = model;
		return a;
	}
	this.list = function(model,...args)
	{
		let a = new listAPI(...args);
		a.url = model;
		return a;
	}
	this.view = function(model,...args)
	{
		let a = new viewAPI(...args);
		a.url = model;
		return a;
	}
	this.edit =  function(model,...args)
	{
		let a = new editAPI(...args);
		a.url = model;
		return a;
	}
});


