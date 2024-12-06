var endpoint = 'http://localhost:3009/api/';
var app = angular.module('uskateApp', []);

app.filter('range', function() {
    return function(input, max) {
        max = parseInt(max, 10);
        for (var i = 0; i < max; i++) {
            input.push(i);
        }
        return input;
    };
});

app.controller('SkateController', function ($scope) {
    //   // Data untuk skates
    $scope.skates = [
    { name: 'Skate 1', image: 'img/skate1.png', link: 'shop_skate.html#board11' },
    { name: 'Skate 2', image: 'img/skate2.png', link: 'shop_skate.html#board12' },
    { name: 'Skate 3', image: 'img/skate3.png', link: 'shop_skate.html#board13' },
    { name: 'Skate 4', image: 'img/skate4.png', link: 'shop_skate.html#board14' },
    { name: 'Skate 5', image: 'img/skate5.png', link: 'shop_skate.html#board15' },
    { name: 'Skate 6', image: 'img/skate6.png', link: 'shop_skate.html#board16' },
    { name: 'Skate 7', image: 'img/skate7.png', link: 'shop_skate.html#board6' },
    { name: 'Skate 8', image: 'img/skate8.png', link: 'shop_skate.html#board17' },
    { name: 'Skate 9', image: 'img/skate9.png', link: 'shop_skate.html#board18' },
    { name: 'Skate 10', image: 'img/skate10.png', link: 'shop_skate.html#board3' }
    ];
});