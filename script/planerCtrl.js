app.controller("planerCtrl", function($scope,$filter, UsrChk, courseData, $stateParams,planService,$auth,$http){
	$scope.title = "Planer";
	$scope.searchField = true;
	$scope.period1 = 1;
	$scope.period2 = 2;
	$scope.credits1 = {"total":0,"g1":0,"g2":0,"a":0};
	$scope.credits2 = {"total":0,"g1":0,"g2":0,"a":0};
	$scope.errors = [];
	$scope.information = [];
	$scope.list1 = [];
	$scope.list2 = [];
	$scope.list3 = [];
	$scope.search = "";
	if($auth.isAuthenticated()){
		$scope.ver = true;
	}else{
		$scope.ver = false;
	}
	courseData.get().success(function(data){
		$scope.list1 = data;
		$scope.list1Filtered = $filter("filter")($scope.list1, {courseCode:""});
	});
	if($stateParams.period === "VT" || $stateParams.period === "HT"){
		$scope.perPeriod = $stateParams.period;
		$scope.perYear = $stateParams.year;
	}


	if($stateParams.planId){
		var authentication = $auth.getToken();
		var output = {"auth":authentication,"period":0,"year":2015,"plan":2};
		alert($scope.perYear);
		var send = JSON.stringify(output);
		$http.get("/fetch/studyplan/?req="+send).success(function(data){
			for(key in data.plans){
				if(data.plans[key].id == $stateParams.planId){				
					for(deepKey in data.plans[key].courses){
						var deepData = data.plans[key].courses[deepKey];
						var tempData = [];
						console.log(tempData.length);
						tempData = $filter("filter")($scope.list1, {courseCode:deepData.course});
						if(tempData.length > 0){
							var i = $scope.list1Filtered.indexOf(tempData[0]);
							if(deepData.period == 1){
								$scope.list1Filtered.splice(i,1);
								$scope.list2.push(tempData[0]);
							}else if(deepData.period == 2){
								$scope.list1Filtered.splice(i,1);
								$scope.list3.push(tempData[0]);
							}
						}
					}				
				}
			}
		});
	}

	if($stateParams.planId === 99 ){
		planService.get().success(function(data){
			for(var key in data.plans){
				for(var val in data.plans[$stateParams.planId].courses){
					var objp = data.plans[$stateParams.planId].courses[val];
					var tempData = $filter("filter")($scope.list1, {courseCode:objp.course});
					if(tempData.length>0){
						var i = $scope.list1.indexOf(tempData[0]);
						if(objp.period == 1){
							$scope.list1Filtered.splice(i,1);
							$scope.list2.push(tempData[0]);
						}else if(objp.period == 2){
							$scope.list1Filtered.splice(i,1);
							$scope.list3.push(tempData[0]);
						}
					}
				}
			}
		});
	}
	$scope.check = function(){
		//console.log($scope.list2);
	}
	$scope.find = function(){
		var comboList = $scope.list3.concat($scope.list2);
		$scope.list1Filtered = $filter("filter")($scope.list1, {$:$scope.search});
		for(var i = 0;i < comboList.length;i++){
			for(var e = 0;e < $scope.list1Filtered.length;e++){
				if(comboList[i] === $scope.list1Filtered[e]){
					$scope.list1Filtered.splice(e,1);
				}
			}
			$scope.list1Filtered.push({});
		}
	}
	$scope.$watch("list2", function(newValue,oldValue){
		$scope.credits1.total = 0;
		$scope.credits1.g1 = 0;
		$scope.credits1.g2 = 0;
		$scope.credits1.a = 0;
		for(var i = 0;i < $scope.list2.length;i++){
			$scope.credits1.total += $scope.list2[i].credits;
			if($scope.list2[i].level === "G1"){$scope.credits1.g1 += $scope.list2[i].credits;}
			if($scope.list2[i].level === "G2"){$scope.credits1.g2 += $scope.list2[i].credits;}
			if($scope.list2[i].level === "A"){$scope.credits1.a += $scope.list2[i].credits;}
			if(!$scope.hasWarning($scope.list2[i])){
				$scope.list2[i].style = "success";
			}
			for(var e = i+1; e < $scope.list2.length;e++){
				if($scope.list2[i].block === $scope.list2[e].block){
					$scope.addWarning(2,$scope.list2[i],$scope.list2[e],"There is a block conflict between " + $scope.list2[i].courseName_sv + " and " + $scope.list2[e].courseName_sv);
				}
			}
			if($scope.list2[i].period != $scope.period1){
				$scope.addWarning(1,$scope.list2[i],$scope.list2[i],"The course " + $scope.list2[i].courseName_sv + " is not avalible during " + $scope.period1);
			}
		}
	},true);
	$scope.$watch("list3", function(newValue,oldValue){
		$scope.credits2.total = 0;
		$scope.credits2.g1 = 0;
		$scope.credits2.g2 = 0;
		$scope.credits2.a = 0;
		for(var i = 0;i < $scope.list3.length;i++){
			if($scope.list3[i].level === "G1"){$scope.credits2.g1 += $scope.list3[i].credits;}
			if($scope.list3[i].level === "G2"){$scope.credits2.g2 += $scope.list3[i].credits;}
			if($scope.list3[i].level === "A"){$scope.credits2.a += $scope.list3[i].credits;}
			if(!$scope.hasWarning($scope.list3[i])){
				$scope.list3[i].style = "success";
			}
			for(var e = i+1; e < $scope.list3.length;e++){
				if($scope.list3[i].block === $scope.list3[e].block){
					$scope.addWarning(2,$scope.list3[i],$scope.list3[e],"There is a block conflict between " + $scope.list3[i].courseName_sv + " and " + $scope.list3[e].courseName_sv);
				}
			}
			if($scope.list3[i].period != $scope.period2){
				$scope.addWarning(1,$scope.list3[i],$scope.list3[i],"The course " + $scope.list3[i].courseName_sv + " is not avalible during " + $scope.period2);
			}
		}
	},true);
	$scope.hasWarning = function(obj){
		var filterWarning = $filter("filter")($scope.errors, {$:obj});
		if(filterWarning.length < 1){
			return false;
		}else{
			return true;
		}
	}
	$scope.addWarning = function(type,obj1,obj2,message){
		var filterWarning = $filter("filter")($scope.errors, {$:message});
		if(filterWarning.length === 0){
			if(type === 2){
				obj1.style = "warning";
				obj2.style = "warning";
				$scope.errors.push({"message":message,"type":"warning","obj1":obj1,"obj2":obj2,"hidden":false});
			}else if(type === 1){
				obj1.style = "danger";
				obj2.style = "danger";
				$scope.errors.push({"message":message,"type":"danger","obj1":obj1,"obj2":obj2,"hidden":false});
			}
		}else{
			console.log("errors aleady exists");
		}
	}
	$scope.addInfo = function(obj){
		var filterInfo = $filter("filter")($scope.information, {$:obj});
		if(filterInfo.length === 0){
			$scope.information.push(obj);
		}
	}
	$scope.hideWarning = function(error){
		error.hidden = true;
	}
	$scope.removeWarning = function(error){
		var i = $scope.errors.indexOf(error);
		$scope.errors.splice(i,1);
	}
	$scope.removeInfo = function(info){
		var i = $scope.information.indexOf(info);
		$scope.information.splice(i,1);
	}
	$scope.resetList = function(){
		for(var key in $scope.list2){
			$scope.list1.push($scope.list2[key]);
			$scope.list1Filtered = $filter("filter")($scope.list1, {$:$scope.search});
			console.log($scope.list2[key]);
		}
		for(var key in $scope.list2){
			$scope.list1.push($scope.list3[key]);
			$scope.list1Filtered = $filter("filter")($scope.list1, {$:$scope.search});
			console.log($scope.list2[key]);
		}
		$scope.list2 = [];
		$scope.list3 = [];
	}
	$scope.saveplan = function(){
		var toSend= [];

		for(var key in $scope.list2){
			toSend.push({"courseCode":$scope.list2[key].courseCode,"period":1,"year":2015});
		}
		for(var key in $scope.list3){
			toSend.push({"courseCode":$scope.list3[key].courseCode,"period":2,"year":2015});
		}
		if(toSend.length > 0){
			var outPeriod = 0;
			if($scope.perPeriod==="vt"){outPeriod=2;}
			else{outPeriod=1;}			
			var authentication = $auth.getToken();
			var output = {"auth":authentication,"period":outPeriod,"year":2015,"plan":toSend};
			var send = JSON.stringify(output);
			$http.post('/push/studyplan/?req='+send)
			.success(function(data){
				console.log(data);
			})
			console.log(output);
		}else{
			console.log("error!");
		}
	}
});