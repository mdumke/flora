(function (global) {
  global.angular
    .module('Flowers', [])
    .controller('FlowersController', FlowersController)

  FlowersController.$inject = ['$scope']

  function FlowersController ($scope) {
    $scope.flower = {
      name: 'sunflower'
    }
  }
}(window))
