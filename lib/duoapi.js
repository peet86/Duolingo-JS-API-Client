/**
* DuoAPI v 1.0.1
* Duolingo JavaScript API Client
* http://vargapeter.com
* MIT License
* Author: Peter Varga (vargapeter.com)
*/

var DuoAPI = (function (window, undefined) {
    
    var api={
	    
        config:{
	        endpoint: 'http://www.duolingo.com/',
	        username: '',
	        default_proxy_url: 'http://query.yahooapis.com/v1/public/yql',
	    },
	    
	    //the currently active language on duo
	    lang:null,
	    
	    // store for the data
	    data:{},
            
        // get duolingo user
        getUser: function() {
	        
	        var profile_endpoint=this.config.endpoint+"users/"+this.config.username;
            
			JSONP({
				url:this.proxyUrl(profile_endpoint),
				data: this.proxyData(profile_endpoint),
				success:function (data){
					
					if(data.query.results!=null){
						
						// all data
						api.data=data.query.results.json; 
						
						// get lang
						api.lang=api.data.learning_language; 
						
						// ready callback
						api.onUserReady();
						
					}else{
						
						api.onUserError();	
										
					}
				},
				error: api.onUserError
            });
        },
        
        // data loaded
	    onUserReady: function(){
		  return null;  
	    },
	    
	    onUserError: function(){
			api.duoError();	
		},

		// proxify         
    	proxyUrl: function(url){
	    	//yahoo evil stuff but you can overwrite with your own..
	        return this.config.default_proxy_url;
        },
        
        // proxify query params
        proxyData: function(url){
	        return {
		        q: "select * from json where url=\""+url+"\"",
		        format: "json"
	        };
        },
        
        // no user with the username / other unexpected answer from duo
        duoError : function(){
	      	console.log("Can't get data from Duolingo.");  
        },
        
    };

    
    var parseProfile = function(){
	        
	    var profile_fields = ['upload-self-service','is_blocked_by','has_observer','deactivated','num_followers','is_following','id','dict_base_url','delete-permissions','site_streak','daily_goal','change-design','inventory','is_self_observer','browser_language','dashboard_redesign','location','username','bio','tts_cdn_url','is_blocking','ui_language','facebook_id','learning_language_string','num_observees','is_follower_by','tts_base_url','trial_account','created','admin','streak_extended_today','learning_language','show_dashboard_ad','twitter_id','freeze-permissions','avatar','gplus_id','rupees','fullname', 'sina_weibo_id','has_google_now','num_following'];
            
        return _filter(api.data,profile_fields);     
	};
    
    
    var parseLanguage =  function(){          
        var language_fields = ['streak','language_string','level_progress','tc_estimate','first_time','num_global_practice','points_rank','fluency_score','direction_status','next_level','num_skills_learned','level_left','no_dep','language_strength','show_practice','max_level','level_percent','language','level','level_points','all_time_rank','max_depth_learned','points','immersion_enabled','max_tree_level'];
            

		return _filter(api.data.language_data[api.lang],language_fields);     
   
	};
    
    
    var parseSkills =  function(){
	                
        var skill_fields = ['dependencies_name','practice_recommended','disabled','more_lessons','missing_lessons','strength','title','id','test','lesson_number','learned','num_translation_nodes','learning_threshold_percentage','description','index','num_lexemes','num_missing','left_lessons','short','locked','name','progress_percent'];

            
        var skills= api.data.language_data[api.lang].skills;
        var results=[];
        for(var s in skills)
        	results[skills[s].index]=_filter(skills[s],skill_fields);

        return results;
    };
    
 	var parseWords =  function(){

        var skills= api.data.language_data[api.lang].skills;
        var results=[];
        
        for(var s in skills)	        
        	results=results.concat(skills[s].words);      	
        
        
        return results;
    };

        
    var _filter = function(items,keep) {
	    var res = {};
	    for (var i in items)
	        if (keep.indexOf(i) > -1) 
	            res[i] = items[i];
	    return res;
    };

    var init = function(config){
        console.log("DuoAPI init")
      
        // set config values
        config = config || {};
        for (var a in config) 
        	 api.config[a] = config[a]; 
			 
		// get the user async
        api.getUser();  
    };

	var setReadyCallback= function(callback){
		api.onUserReady=callback;		
	};

	var setErrorCallback= function(callback){
		api.onUserError=callback;		
	};
	
	var setProxyCallback= function(callback){
		api.proxyUrl=callback;		
	};	
	
	var setProxyDataCallback= function(callback){
		api.proxyData=callback;		
	};	
	
  
    // utils  
    return {
        getUser: init,						// get userdata (init)
        onUserReady: setReadyCallback,		// when userdata ready
        onUserError: setErrorCallback,		// when can't get data..
        proxyUrl: setProxyCallback,			// to define your own proxy url
        proxyData: setProxyDataCallback, 	// to define your own proxy query parameter values
        getProfile: parseProfile,			// user's profile data
        getLanguage: parseLanguage,			// user's current lange on duolingo
        getSkills: parseSkills,				// user's skills (lessons)
        getWords: parseWords				// user's words 
    };

})(window);



