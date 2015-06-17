# Duolingo-JS-API-Client
Unofficial JavaScript "API client" for Duolingo.com
Get any user's profile, words, lessons and more by username

###Sample usage:
```js
	DuoAPI.getUser({username:"peet86"});
		
	DuoAPI.onUserReady(function(){
		console.log(DuoAPI.getProfile().fullname);
		console.log(DuoAPI.getWords());	
	});
```

### Updates

#### v1.0.1 
- initial release

## License
This library is available under MIT license.
