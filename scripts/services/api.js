app.service('apiService', function($http,$timeout,$rootScope,schemaService) 
{
  let apiService  = this;
  this.apis = [];

  this.free  =function()
  {
    this.apis = [];
  }

  this.reset_events = function()
  {
    for(let i in this.apis)
      this.apis[i].reset_events();
  }

  this.find = function(id)
  {
    let match  = [];
    let ids = [];
    let _this = this;
    for(let i in this.apis)
      if(this.apis[i].config.id==id)
      {
        match.push(this.apis[i]);
        ids.push(i);
      }

    let a  = 
    { 
      apis: match, 
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
      },
      remove: function(cb)
      {
        for(let i of ids)
          _this.apis[i] = null;
        let offset = 0;
        for(let i in _this.apis)
          if(!_this.apis[i])
          {
            _this.apis.splice(i-offset++,1);
          }
      }
    };
    return a;
  };

  this.new = function(config)
  {
    let a;
    if(this.find(config.id).apis[0])
      this.find(config.id).remove();
    a = new Api(config);
    this.apis.push(a);
    return a;
  }

  class Api
  {
    constructor(config)
    {
      this.config = 
      {
        //required
        model: "",
        method: "",

        //public
        url: "",
        param: "",
        target: "",

        //readonly
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
        value: "",
        feedback: 
        {
          success: "",
          error: "",
        },
        state: 
        {
          loading: false
        },
        missing_fields: [],

        //private
        event: {}
      }


      for(let i in config)
        this.config[i] = config[i];
      behavior[this.config.method](this);
    }

    load(payload,restrict,cb)
    {
        let api = this.config;
        let event = this;

        api.feedback.error = "";


        if(restrict)
        {
          let temp_load = JSON.parse(JSON.stringify(payload));
          let field = restrict.split(",");
          for(let i in temp_load)
          {
            if(!field.includes(i))
              delete temp_load[i];
          }
          payload = temp_load;
        }

        let destination = (api.url || api.model) + ((api.method == "list" || api.method == "post")? "": "/"+api.target) + (api.param? ("?"+api.param) : "");
        let param  = api.param? "?" + api.param : "";
        this.emit("preload");

        if(!this.validate(payload))
            return api.feedback.error = api.incomplete_default || "Please fill up required fields";
        api.state.loading =true;
        console.log("/api/"+destination,payload);
        $http[api.method=="list"? "get": api.method]("/api/"+destination,payload).then(
          function(res)
          {
            res = res.data;
            api.state.loading = false;
            if(res.err)
            {
              console.log(res.err);
              api.feedback.error = res.err;
              event.emit("error",res.err);
              return;
            }
            event.emit("success",res);
            cb && cb(res);
          },
          function(err)
          {
            api.state.loading = false;
            event.emit("error",err);
          });

        let r =
        {
           on: function(ev,cb)
           {
                event.on(ev,cb);
           }
        };
        return r;
    }


    validate()
    {
      return true;
    }
    reset_events()
    {
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
        a = this.config.event[event][i](...args) && a;
      }
      return a;
    }
  }


  let behavior ={}
  behavior["list"] = function(api)
  {
      api.limit = 10;
      api.page = 0;


      api.load_options = function()
      {
        let destination = api.config.url || api.config.model;
        $http.get('/api/'+destination+'?option=true').then((res)=>
        {
          res = res.data;
          api.options = res;
          if( api.page*api.limit > api.options.collectionCount )
          {
            api.page = Math.floor(api.options.collectionCount/api.limit ) -1;
          }
          api.page_max = Math.ceil(api.options.collectionCount/api.limit) -1;
        });
      }

      api.next = function()
      {
        api.page+=1;
        api.load();
      }

      api.prev = function()
      {
        api.page = (api.page <= 0) ? 0 : (api.page - 1);
        api.load();
      }
  }
  behavior["post"] =  function(api){
    api.validate = function(payload)
    {
        let required = schemaService.getRequired("post",api.config.model);
        let missing = [];
        if(!api.config.url)
        for(let field of required)
        {
          if( (field.split(".").length > 1)? [NaN,undefined,null,""].includes(payload[field.split(".")[0]][field.split(".")[1]]) : [NaN,undefined,null,""].includes(payload[field])    )
            missing.push(field);
        }
        api.missing_fields  =missing;
        console.log(missing);
        return !missing.length;
    }
  }
  behavior["get"] =  function(api){}
  behavior["put"] =  function(api){
    api.validate = function(payload)
    {
        let required = schemaService.getRequired("put",api.config.model);
        let missing = [];
        for(let field of required)
        {
          if( (field.split(".").length > 1)? [NaN,undefined,null,""].includes(payload[field.split(".")[0]][field.split(".")[1]]) : [NaN,undefined,null,""].includes(payload[field])    )
            missing.push(field);
        }
        api.missing_fields  =missing;
        return !missing.length;
    }}
  behavior["delete"] =  function(api){}
});


