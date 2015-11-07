app.controller("nCtrl", function($scope, $http,$auth){
	$http.get("script/fil.json").success(function(data){
		$scope.countries = data;
	});
});
app.controller("loginCtrl", function($scope, UsrChk, $auth){
	$scope.title = "Login";

	$scope.authenticate = function(provider) {
		$auth.authenticate(provider);
		$scope.ver = true;
	};
	if($auth.isAuthenticated()){
		$scope.ver = true;
	}else{
		$scope.ver = false;
	}
	$scope.logout = function(){
		$auth.logout();
		$scope.ver = false;
	};
});
app.controller("settingsCtrl", function($scope,$filter,$auth,$http, Account){
	$scope.title = "Settings";
	if($auth.isAuthenticated()){
		$scope.ver = true;
	}else{
		$scope.ver = false;
	}
	$scope.magic = function(){
		var authentication = $auth.getToken();
		console.log(authentication);
		var output = {"auth":authentication,"data":"data"};
		var send = JSON.stringify(output);
		$http.get('/push/coursedata/?req='+send)
		.success(function(data){
			var token = $auth.getToken();
		})
	};
	$scope.getProfile = function() {
		Account.getProfile()
		.success(function(data) {
			$scope.user = data;
		})
	};
	$scope.getProfile();
});
app.controller("searchCtrl", function($scope,$filter,courseData,$auth){
	$scope.title = "Course Search";
	$scope.institution ="";
	if($auth.isAuthenticated()){
		$scope.ver = true;
	}else{
		$scope.ver = false;
	}
	courseData.get().success(function(data){
		$scope.list = data;
		$scope.listFiltered = $filter("filter")($scope.list, {institution:""});

	});
	$scope.searchResult = function(){
		$scope.listFiltered = $filter("filter")($scope.list, {$:$scope.course,institution:$scope.institution,block:$scope.block,period:$scope.period});
	}
});

