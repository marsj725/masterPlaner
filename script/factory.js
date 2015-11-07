app.factory('Account', function($http) {
return {
	  getProfile: function() {
		return $http.get('/api/me');
	  },
	  updateProfile: function(profileData) {
		return $http.put('/api/me', profileData);
	  }
	};
});
app.factory("UsrChk", function(){
	return {
		getUser: function(){
			return {"user":{"name":"Martin Sjödin Jonsson"}};
		}
	};
});
app.factory("courseData", function($http){
	return {
		get: function(){
			return $http.get('/get/coursedata/');
		}
	}
});
app.factory("profileData", function($http){
	return {
		get: function(){
			return $http.get("static/script/req.json");
		}
	}
});
app.factory("serverCall", function($http){
	return{
		get: function(){
			return $http.post("plan/?str=hej");
		}
	}
});
app.factory("planService" ,function($http){
	return{
		get: function(){
			return $http.get("static/script/fil.json");
		}
	}
});