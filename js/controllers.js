app.controller("appCtrl", ['$rootScope', '$firebase', '$state', '$scope', function($rootScope, $firebase, $state, $scope){

  var listsRef = new Firebase("https://todo-webdev.firebaseio.com/").child("lists");
  var usersRef = new Firebase("https://todo-webdev.firebaseio.com/").child("users");

  $rootScope.listsDB = $firebase(listsRef).$asArray();
  $rootScope.usersDB = $firebase(usersRef).$asArray();

  $rootScope.loginUser = false;

  if(!$rootScope.loginUser)
    $state.go('login');
  else
    console.log($rootScope.loginUser);

  $scope.listName = null;
  $scope.newList = function() {
    $rootScope.listsDB.$add({
      "name": $scope.listName,
      "news": [],
      "subscribers": [{"id":$rootScope.loginUser.$id, "email": $rootScope.loginUser.email, "password":$rootScope.loginUser.password}],
    });
    $scope.listName = null;

  }; 

  $("#the-container").hide();
  var inputVisible = false;
  $scope.newClick = function() {
    if(!inputVisible){
      $("#the-container").slideDown();
      $("#the-input").attr("placeholder", "Entere list name");
      inputVisible = true;
    } else {
      $("#the-container").slideUp();
      inputVisible = false;
    }
  };

  $scope.joinClick = function() {
    if(!inputVisible){
      $("#the-container").slideDown()
      $("#the-input").attr("placeholder", "Entere list id");
      inputVisible = true;
    } else {
      $("#the-container").slideUp();
      inputVisible = false;
    }
  };

}]);

app.controller('listsCtrl', ['$scope', '$firebase','$rootScope', function($scope, $firebase, $rootScope){


  // $rootScope.usersDB.$add({
  //   'email' : 'nixi_xd@yahoo.com',
  //   'password' : '12345678',
  // });

  $scope.lists = $rootScope.listsDB;

}]);

app.controller('listCtrl', function($scope, $stateParams, $rootScope, $firebase, $state) {
  $rootScope.listsDB.forEach(function(l){
    if( l.$id == $stateParams.id )
      $scope.list = l;
  });

  $scope.story = null;

  console.log($scope.list.$id);
  $scope.newStory = function() {
    var listRef = new Firebase("https://todo-webdev.firebaseio.com/").child("lists").child($scope.list.$id).child("news");
    var db = $firebase(listRef).$asArray().$add({
      "content": $scope.story,
      "author": $rootScope.loginUser.email,
      "date" : Firebase.ServerValue.TIMESTAMP,
    });
    $scope.story = null;
  }

  $scope.quitList = function() {
    //TODO make it work
    $state.go('lists');
  }
});

app.controller('loginCtrl',['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){

  $scope.doLogin = function() {
    $scope.error = false;
    $rootScope.usersDB.forEach(function(user){
      if( user.email.toLowerCase() == $scope.email.toLowerCase() && user.password == $scope.password ){
        $rootScope.loginUser =  user;
      }
      if( user.email.toLowerCase() == $scope.email.toLowerCase() && user.password != $scope.password ){
        $scope.error = "This email in alrady there and has another password.";
      }
    });

     if( !$rootScope.loginUser && !$scope.error ){
      $rootScope.usersDB.$add({
        'email' : $scope.email,
        'password': $scope.password,
      });
      // ugly shit
      // TODO rename $scope.error to $scope.message
      // TODO make shit prettier
      $scope.error = "You are now registered. Press enter again to login."
    }
    if(!$scope.error)
      $state.go('lists')
  };
}]);