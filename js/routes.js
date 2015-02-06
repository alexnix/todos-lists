app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/login");
	$stateProvider
	.state('lists', {
		url:'/lists',
		controller:'listsCtrl',
		templateUrl:'views/lists.html',
	})
	.state('list', {
		url: '/list/{id}',
		controller:'listCtrl',
		templateUrl:'views/list.html',
	})
	.state('login', {
		url:'/login',
		controller:'loginCtrl',
		templateUrl:'views/login.html',
	});
});