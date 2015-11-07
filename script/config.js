var app = angular.module('app', ['ui.router','satellizer','ngDragDrop']);

app.config(["$urlRouterProvider", "$stateProvider", "$authProvider", "$locationProvider", function($urlRouterProvider,$stateProvider,$authProvider,$locationProvider){
	
	$locationProvider.html5Mode({
		enabled:true,
		requireBase:false
	});

	$authProvider.facebook({
	  clientId: '525294134275957'
	});

	$urlRouterProvider.otherwise("/");		
	$stateProvider
		.state("login", {
			url: "/",
			templateUrl: "static/templates/login.html",
			controller: "loginCtrl"
		})
		.state("planer", {
			url: "/planer/:planId/:period/:year",
			templateUrl: "static/templates/home.html",
			controller: "planerCtrl"
		})
		.state("manage", {
			url: "/manage",
			templateUrl: "static/templates/manage.html",
			controller: "manageCtrl"
		})
		.state("settings", {
			url: "/settings",
			templateUrl: "static/templates/settings.html",
			controller: "settingsCtrl"
		})
		.state("search", {
			url: "/search",
			templateUrl: "static/templates/search.html",
			controller: "searchCtrl"
		});
}]);