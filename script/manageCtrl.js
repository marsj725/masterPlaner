app.controller("manageCtrl", function($scope,$filter, UsrChk, $stateParams, serverCall, Account, profileData, $http, $auth){
	$scope.title = "Overview ";
	$scope.list = [];
	$scope.sel1 = "HT";
	$scope.sel2 = 2015;
	$scope.credits = {"advanced":0,"g1":0,"g2":0};
	$scope.creditsReq = {"advanced":30,"g1":10,"g2":20};
	var send = {"hej":"hej"};
	sendTo = JSON.stringify(send);
	//var toSend = JSON.stringify(send);
	profileData.get(send).success(function(data){
		$scope.required = data.Requirements.requiredCourses;
		$scope.recommended = data.Requirements.recommendedCourses;
	});
	var authentication = $auth.getToken();
	if($auth.isAuthenticated()){
		$scope.ver = true;
	}else{
		$scope.ver = false;
	}
	var output = {"auth":authentication,"period":0,"year":$scope.sel2,"plan":1};
	var send = JSON.stringify(output);
	console.log("ToSEND: "+send)

	$http.get("/fetch/studyplan/?req="+send).success(function(data){
		$scope.list = data;
		$scope.title = $scope.list.name + " : " + $scope.list.masterprogram;
		console.log("Retrieved" + data);
		for(key in data.plans){
			for(course in data.plans[key].courses){
				console.log(data.plans[key].courses[course].period);
				if(data.plans[key].courses[course].type==="A"){$scope.credits.advanced += data.plans[key].courses[course].credits;}
				if(data.plans[key].courses[course].type==="G1"){$scope.credits.g1 += data.plans[key].courses[course].credits;}
				if(data.plans[key].courses[course].type==="G2"){$scope.credits.g2 += data.plans[key].courses[course].credits;}
				var filteredReq = $filter("filter")($scope.required, {code:data.plans[key].courses[course].course});
				if(filteredReq.length > 0){
					var i = $scope.required.indexOf(filteredReq[0]);
					$scope.required.splice(i,1);
				}
				var filteredRec = $filter("filter")($scope.recommended, {code:data.plans[key].courses[course].course});
				if(filteredRec.length > 0){
					var i = $scope.recommended.indexOf(filteredRec[0]);
					$scope.recommended.splice(i,1);
				}
			}
		}
	});
	$scope.removePlan = function(plan){
		var i = $scope.list.plans.indexOf(plan);
		$scope.list.plans.splice(i,1);
	}
});