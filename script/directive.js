angular.module("app")
.directive("courseList", function(){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "static/templates/courseList.html",
		controller: function($scope){
			$scope.list = $parent.list;
		}
	}
});
