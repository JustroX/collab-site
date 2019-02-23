app.service('modelService', function($http,$timeout,$rootScope,apiService,schemaService) 
{

	let modelService = this;
	this.models = [];
	function cap(str){return str.charAt(0).toUpperCase() + str.slice(1)}
	function remove_population(model,obj)
	{
		let populate = schemaService.definitions[cap(model)].populate; 
		for(let i in populate)
		{
			let fields = populate[i].split(".");
			let parent = obj;
			let key = fields[i];
			let x = 0;
			while( x <fields.length-1  )
			{
				parent = parent[key];
				key = fields[i+1];
			};

			if(parent[key])
			{
				if(parent[key].length)
					for(let j in parent[key])
						parent[key][j] = parent[key][j]._id;
				else
					parent[key] = parent[key]._id;
			}
		}
		return JSON.parse(JSON.stringify(obj));
	}

	this.reset_events = function()
	{
	    for(let i in this.apis)
	      this.models[i].reset_events();
	}
	this.find = function(id)
	{
		let match  = [];
		for(let i in this.models)
			if(this.models[i].config.id==id)
				match.push(this.models[i]);

		let a  = 
		{ 
			res: match, 
			config: function(key,val)
			{
				for(let i in match)
					match[i].config[key] = val;
				return a;
			},
			on: function(event,f_)
			{
				for(let i in match)
					match[i].on(event,f_);
				return a;
			},
			load: function(cb_success,cb_error)
			{
				for(let i in match)
					match[i].load(cb_success,cb_error);
				return a;
			},
			each: function(cb)
			{
				for(let i in match)
					cb(match[i])
				return a;
			}
		};
		return a;
	};

	this.new = function(config)
	{
		let a = new Model(config);
		this.models.push(a);
		return a;
	}


	class Model
	{
		constructor(config)
		{
			this.config = 
			{
				id :  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
				target: "",
				model: "",
				event: {},
				mode: "view"
			}; 

			this.value = 
			{
				persistent : {}, //no populate
				model : {},      //with popoulate
				changes : {}     //with populate / but removed when saved
			};

			this.api = 
			{
				get: apiService.new({ method: "get", model: config.model  }),
				put: apiService.new({ method: "put", model: config.model }),
				delete: apiService.new({ method: "delete", model: config.model }),
			}

			let model = this;
			for(let i of ["get","put","delete"])
			{
				let api = this.api[i];
				if(config.url)
					api.config.url =  config.url;
			}


			model.api.get.on("success",function(res){
				model.value.persistent = remove_population( model.config.model ,res);
				model.value.model = res;
				model.emit("loaded",res);
			});
			model.api.put.on("preload",function(res){
				model.value.changes = remove_population( model.config.model ,model.value.model);
				if(JSON.stringify(model.value.persistent) == JSON.stringify(model.value.changes))
					return console.log("API WARNING: No changes to save.");
			});
			model.api.put.on("success",function(res){
				model.value.persistent = remove_population( model.config.model ,res);
				model.value.model = res;
				model.api.get.load();
				model.emit("saved",res);
			});
			model.api.delete.on("success",function(res){
				model.emit("deleted",res);
			});
			

			for(let i in config)
				this.config[i] = config[i];
		}

		load(target)
		{
			let a;
			let e;
			let model = this;
			model.config.target  =target;

			if(!target)
			$timeout(function()
			{
				e && e({ err: "Target is not specified",code: 1});
			},1);
			
			for(let i of ["get","put","delete"])
			{
				let api = model.api[i];
				api.config.target = target;
			}

			this.api.get.load()
			.on("success",function(res)
			{
				a && a(model.value.model);
			});
			this.api.get.on("error",function(res)
			{
				e && e(res);
			});

			let r = { then: function(cb){ a = cb; return r; } , error: function(cb){e = cb; return r;} };
			return r;
		}

		save(restrict)
		{
			let a;
			let model = this;

			this.api.put.load(model.value.model,restrict).on("success",function(res)
			{
				a && a();
			});
			return { then: function(cb){ a = cb; } };
		}

		delete()
		{
			let a;
			this.api.delete.load().on("success",function(res)
			{
				model.emit("deleted",res);
				a && a();
			});
			return { then: function(cb){ a = cb; } };
		}

		reset_event()
		{
			let p = ["get","put","delete"];
			for(let i of p)
				this.api[i].reset_events();
			this.config.event = {};
		}


		on(event,f_)
		{
			if(!this.config.event[event])
				this.config.event[event] = [];
			this.config.event[event].push(f_);
		}
		emit(event,...args)
		{
			let a = true;
			for(let i in this.config.event[event])
			{
				a = this.config.event[event][i](args) && a;
			}
			return a;
		}


	}
});


