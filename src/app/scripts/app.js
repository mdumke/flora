import sunflowerImgBig from '../images/sunflower_big.jpg'
import sunflowerImgSmall from '../images/sunflower_small.jpg'

(function (global) {
  global.angular
    .module('Flowers', [])
    .controller('FlowersController', FlowersController)

  FlowersController.$inject = ['$scope']

  function FlowersController ($scope) {
    $scope.flower = {
      name: 'Sunflower',
      urlSmall: sunflowerImgSmall,
      urlBig: sunflowerImgBig
    }
  }
}(window))
