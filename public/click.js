angular.module('buttons',[])
.controller('buttonCtrl',ButtonCtrl)
.factory('buttonApi',buttonApi)
.constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope,buttonApi){
  $scope.buttons=[]; //Initially all was still
  $scope.priceList=[];
  $scope.errorMessage='';
  $scope.isLoading=isLoading;
  $scope.refreshButtons=refreshButtons;
  $scope.buttonClick=buttonClick;
  //$scope.totalPrice=0;
  //$scope.totalPrice=localStorage.getItem("TotalPrice");
  $scope.totalPrice=0;
  var price = 0;
  var loading = false;
  var TotalPrice = 0;
  var priceList = [];

  function isLoading(){
    return loading;
  }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
    .success(function(data){
      $scope.buttons=data;
      loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable to load Buttons:  Database request failed";
      loading=false;
    });
  }
  function buttonClick($event){
    $scope.errorMessage='';
    buttonApi.clickButton($event.target.id)
    .success(function(){
      getTransaction()
    })
    .error(function(){$scope.errorMessage="Unable click";});
  }

  function getTransaction(){
    $scope.errorMessage='';
    buttonApi.getTransaction()
    .success(function(data){
      console.log("About to calculate totalPrice with "+data.length+"elements");
      for(var i = 0; i < data.length; i++){
        TotalPrice += data[i].totalPrice;
      }
      $scope.totalPrice = TotalPrice;
      $scope.priceList = data;
      TotalPrice = 0;
      loading=false;
    })
    .error(function(){$scope.errorMessage="Unable to get transactions table";});
  }

  function updatePriceList(){
    var table = document.getElementById("priceList");
    var row = table.insertRow(1);
    row.insertCell(0).innerHTML = "Item";
    row.insertCell(1).innerHTML = "Quantity";
    row.insertCell(2).innerHTML = "sss";

  };
//updatePriceList();
  getTransaction();
  refreshButtons();  //make sure the buttons are loaded
}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    getTransaction: function(){
      var url = apiUrl+'/transactions';
      return $http.get(url);
    }
  };
}
