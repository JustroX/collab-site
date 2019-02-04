app.service('utilService', function($http,$timeout,$rootScope,schemaService) 
{
  let pickers = [];
  class  Picker
  {
    constructor(config)
    {
      this.config = 
      {
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
        list: [],
        field: "_id",
        event: {},
        
        value: null
      }
      for(let i in config)
        this.config[i] = config[i];
    }
    label(i)
    {
      return i[this.config.field];
    }
    change()
    {
      this.emit("change",this.config.value);
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



  this.picker = function(config)
  {
    if(config)
    {
      let a = new Picker(config);
      pickers.push(a);
      return a;
    }
    else
    {
      let a = 
      {
        find: function(id)
        {
          let match  = [];
          for(let i in pickers)
            if(pickers[i].config.id==id)
              match.push(pickers[i]);

          let b  = 
          { 
            pickers: match, 
            config: function(key,val)
            {
              for(let i in match)
                match[i].config[key] = val;
              return b;
            },
            on: function(event,f_)
            {
              for(let i in match)
                match[i].on(event,f_);
              return b;
            },
            each: function(cb)
            {
              for(let i in match)
                cb(match[i])
              return b;
            }
          };
          return b;
        }
      };
      return a;
    }
  } 
});


