
var app=angular.module('Blog',['ui.router','ngToast','textAngular']);
app.controller('body',function($scope,$rootScope) {
});
app.run(function($rootScope,$timeout,Auth,$http,$state){alert("run");
//$http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=harbour&key=AIzaSyA78-0yEe_3G15w1jvnYY_k_Y60aTuDFfA',function(err,res){console.log(res);})

$rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
  console.log(toState);alert("auth")
  if(toState.auth==true){alert("auth")
  /*Auth.authenticate().then(function(res){
    if(res)
    console.log("Its"+res)
    else {$state.go('login')
      console.log("Its"+res);
    }
  })*/}



})

/*$timeout(function(){
Stamplay.User.currentUser().then(function(res){
if(res.user){
  $rootScope.logged=true;
  $rootScope.firstname=res.user.firstname;
}
else {alert("hello");
  $rootScope.logged=false;
}

},function(err){})
})*/

})
app.factory('Auth',function($q,$rootScope){
return {authenticate:function(){alert("hi")

  var d=$q.defer();
  Stamplay.User.currentUser(function(err,res){
    if(err){
    d.resolve(false);alert('false');
    $rootScope.logged=false;}
    if(res.user){d.resolve(true);
$rootScope.logged=true
    }
    else {d.resolve(false)
      $rootScope.logged=false;
    }
  })
  return d.promise;
}}

})
app.config(function($stateProvider,$urlRouterProvider,$locationProvider){
Stamplay.init("myblog44");
$locationProvider.hashPrefix('');
$stateProvider
.state('signup',{
url:'/signup',
templateUrl:'structures/signup.html',
controller:'signuppage'
})
.state('login',{
  url:'/login',
  templateUrl:'structures/login.html',
  controller:'loginctrl'
})
.state('home',{
url:'',
templateUrl:'structures/jumbotron.html',
controller:'todisableselect',
auth:true
})
.state('home2',{
url:'/home',
templateUrl:'structures/jumbotron.html'
})
.state('viewBlogs',{
  url:'/viewBlogs',
  templateUrl:'structures/viewBlogs.html',
  controller:'viewBlogs',
  auth:true
}
)
.state('createblogs',{
  url:'/createblogs',
  templateUrl:'structures/createblogs.html',
  controller:'createblogs',
  auth:true
})
.state('editposts',{
url:'/edit/:postid',
templateUrl:'structures/Postedits.html',
controller:'editposts',
auth:true

})
.state('readpost',{
  url:'/readpost/:id',
  templateUrl:'/structures/readpost.html',
  controller:'readpost'
})
$urlRouterProvider.otherwise('');

});
/* //OLD ROUTE
app.config(function($routeProvider,$locationProvider)
{Stamplay.init("myblog44");
$locationProvider.hashPrefix('');

$routeProvider
.when('/login',{
templateUrl:'structures/login.html',controller:'loginctrl'
})
.when('/',{templateUrl:'structures/jumbotron.html'
})
.when('/signup',{templateUrl:'structures/signup.html',controller:'signuppage'
})
});

*/
app.filter("postcontent",function(){
return function(text){
return text? text.replace(/<[^>]+>/gm,'') : '';

}

});

app.controller('todisableselect',function($rootScope){$rootScope.select=false})
app.controller('readpost',function($scope,$stateParams,ngToast,$timeout,$rootScope,$state){$rootScope.select=true;
  $scope.comment=""
  postid=$stateParams.id;
  $scope.post={}
  $timeout(function(){
  Stamplay.Object('blogs').get({_id:postid}).then(function(res){
$scope.post=res.data[0]
$scope.commentdata=$scope.post.actions.comments;
console.log($scope.commentdata);
$scope.displaydata=[]
$scope.commentdata.forEach(function(item,index){console.log("i"+item.userId);
Stamplay.User.get({"_id":item.userId}).then(function(res){console.log("u"+res.data[0]);var firstname=res.data[0].firstname;$scope.displaydata.push({user:firstname,data:item.text});$scope.$apply()},function(err){})

})
$scope.$apply();
  },function(err){})
})
$scope.postcomment=function(cpostid)
{//alert("came");
  if($scope.comment){
  Stamplay.Object('blogs').comment(postid,$scope.comment).then(function(res)
{console.log("Commented data"+res);
$state.go('viewBlogs');
  $state.$apply();


},function(err){console.log("ERR"+err);ngToast.create("Error"+err)})}
else {alert("please fill");
  ngToast.create("Please comment")
}

}





})
app.controller('globalposts',function($scope,$timeout,$rootScope,$state){alert("came")
  $timeout(function(){
Stamplay.Object('blogs').get().then(function(res){console.log(res);
$scope.blogobject=res.data;
$scope.$apply();
},function(err){})
});

})
app.controller('editposts',function($state,$stateParams,$scope,$timeout,ngToast){
var postid=$stateParams.postid;
$timeout(function(){
  Stamplay.Object("blogs").get({_id:postid}).then(function(res){
    console.log(res);
$scope.post=res.data[0];
$scope.$apply();
  },function(err){});});
  $scope.update=function(){
if($scope.post.title&&$scope.post.content)
{$scope.post.actions={comments:["hello"]}
console.log($scope.post);
  Stamplay.Object('blogs').update(postid,$scope.post).then(function(res){ngToast.create('Success');$state.go('viewBlogs')},function(err){ngToast.create('problm occured')})


}
else {
  ngToast.create("PLease check fields");
}

  }






});



app.controller('createblogs',function($scope,taOptions,ngToast,$timeout,$state,$rootScope){  $rootScope.select=true;
  $scope.newpost={}
  taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
    ];
    $scope.createpost=function(){
if($scope.newpost.title&&$scope.newpost.content)
{
Stamplay.Object("blogs").save($scope.newpost).then(function(res){$timeout(function(){console.log(res);ngToast.create("Created successfully")});$state.go("viewBlogs")},function(err){ngToast.create("Problem has occured while creating blog")})

}
else {
  ngToast.create("Please check the fields");
}}
});

app.controller('menu',function($scope,$timeout,$rootScope,$state,ngToast){
  $timeout(function(){
  Stamplay.User.currentUser().then(function(res){
  if(res.user){alert("user");
    $rootScope.logged=true;
    $rootScope.firstname=res.user.firstname;
  }
  else {
    $rootScope.logged=false;
  }

  },function(err){})})
  $scope.logout=function(){
localStorage.removeItem("http://localhost:8000-jwt");
$rootScope.logged=false;
$timeout(function(){
ngToast.create("You are logged out");});
$state.go("home");

  }

$scope.data="hu";

});
app.controller('viewBlogs',function($scope,ngToast,$state,$timeout,$rootScope){  $rootScope.select=true;
  $scope.blogobject={};
  $timeout(function(){
Stamplay.User.currentUser().then(function(res){
if(res.user)
{
  userid=res.user._id;
  Stamplay.Object('blogs').get({owner:userid}).then(function(response){
    $scope.blogobject=response.data;
    console.log($scope.blogobject);
$scope.$apply();
},function(err){});}
else {
  $timeout(function(){ngToast.create("Please login");});
  $state.go("login");
}},function(err){});

});
});


app.controller('loginctrl',function($scope,$timeout,$state,$rootScope,ngToast){$rootScope.select=true;
if($rootScope.logged)
{ngToast.create("You are already logged in");
  $state.go('viewBlogs');
}
else {
  $scope.email="";
  $scope.password="";
  $scope.login=function(){
    Stamplay.User.login({email:$scope.email,password:$scope.password}).then(function(res){console.log("success"+res);
    ngToast.create("Logged in");
    $rootScope.logged=true;
    $rootScope.firstname=res.firstname;
  $state.go('viewBlogs');
},function(err){console.log("err"+err);ngToast.create("Invalid Username or password")});
  }
}
/*Stamplay.User.currentUser().then(function(res){
console.log(res.user);
if(res.user){
  $timeout(function(){$state.go('viewBlogs')});
}
else{alert("came");$scope.email="";
$scope.password="";
$scope.login=function(){alert("logged");
  Stamplay.User.login({email:$scope.email,password:$scope.password}).then(function(res){console.log("success"+res);
$state.go('viewBlogs');
},function(err){console.log("err"+err);});
}}
},function(err){})*/
});


app.controller('signuppage',function($scope,$timeout,$state,$rootScope){$rootScope.select=true;
Stamplay.User.currentUser().then(
function(res){

  if(res.user){
$timeout(function(){$state.go('/viewBlogs');})
}
  else{
    $scope.sfirstname="";
    $scope.lastname="";
    $scope.email="";
    $scope.password=""
    $scope.signup=function(){alert("came");
      if($scope.sfirstname&&$scope.lastname&&$scope.email&&$scope.password)
      {
    var data={firstname:$scope.sfirstname,lastname:$scope.lastname,email:$scope.email,password:$scope.password};
    Stamplay.User.signup(data).then(function(res){
      console.log("success: "+res);alert("successfully created");
      $rootScope.logged=true
    //  localStorage.removeItem('http://localhost:8000-jwt');
    //  localStorage.clear();
    },function(err){
      console.log("err");
    });}
      else {
        alert("Please check fields");}}

  }
},function(err){});})

// WEATHERAPI CODE
