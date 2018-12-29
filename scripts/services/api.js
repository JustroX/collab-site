app.service('apiService', function(session,$http,$timeout) 
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
			this.loading = true;
			if(!this.target) this.error="API: Target not specified";
			$http.delete('/api/badge/'+api_.target).then((res)=>
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
		constructor($scope)
		{
			this.loading = false;
			this.$scope = $scope;
			this.error = "";
			this.succ = "";
		}
		submit()
		{
			let api_ = this;
			if(!api_.validate())
			{
				api_.error = "Can't post an empty content.";
				return;
			}	
			api_.error = '';
			api_.loading = true;
			$http.post('/api/badge',this.$scope.model).then((res)=>
			{
				res = res.data;

				api_.loaded(res);

				api_.loading = false;
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
			if(this.$scope.parent_api)
				this.$scope.parent_api.new.success(res);
		}
	}

	class listAPI
	{
		constructor(...args)
		{
			this.loading = false;
			this.error  = false;

			this.limit = 10;
			this.page = 0;
			this.options = null;

			this.list = [];
			this.param = "";
		}

		load()
		{
			let api_ = this;
			session.onready(function()
			{
				api_.loading = true;
				$http.get('/api/badge?limit='+api_.limit+'&offset='+api_.page+'&'+api_.param).then((res)=>
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
			$http.get('/api/badge?options=true').then((res)=>
			{
				res = res.data;
				api_.options = res;
			});
		}

		next()
		{
			this.page+=1;
			this.load();
		}

		prev()
		{
			this.page = (this.page < 0) ? 0 : (this.page - 1);
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
		load()
		{
			let api_ = this;
			session.onready(function()
			{
				api_.loading = true;
				$http.get('/api/badge/'+api_.target+'?'+api_.param).then((res)=>
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
			$http.get('/api/badge?options=true').then((res)=>
			{
				res = res.data;
				this.options = res;
			});
		}
		err(mes)
		{
			this.error = mes;
			console.log("API ERROR: "+mes);
		}
		success(res)
		{
			this.value = res;
			this.$scope.model = res;
		}
	}

	class editAPI
	{
		constructor($scope,model)
		{
			this.loading = false;
			this.error = "";
			this.$scope  =$scope;
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
			$http.put('/api/badge/'+api_.view.target,this.$scope.model).then((res)=>
			{
				res = res.data;
				api_.loaded(res);
				api_.loading = false;
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
			if(this.$scope.parent_api)
				this.$scope.parent_api.edit.success(res);
		}
	}


	this.delete = function(...args)
	{
		return new deleteAPI(...args)
	}
	this.new = function(...args)
	{
		return new newAPI(...args)
	}
	this.list = function(...args)
	{
		return new listAPI(...args)
	}
	this.view = function(...args)
	{
		return new viewAPI(...args)
	}
	this.edit =  function(...args)
	{
		return new editAPI(...args);
	}
});


