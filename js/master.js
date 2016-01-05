var movieApp = angular.module('ShowMotion', ['ngRoute']);
movieApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController',
    })
    .when('/results/:Results', {
        templateUrl: 'templates/results.html',
        controller: 'ResultsController'
    })
    .when('/specificMovie/:name', {
        templateUrl: '/templates/movie.html',
        controller: 'MovieController',
    })
    .otherwise({
        redirectTo: '/'
    });
});
movieApp.factory('MovieSearch', ['$http', function($http) {
    var api_key = '9260efc4af21f1151c5cf0b388aa7df3';
    var movieFind = function (query) {
        var movieURL = 'http://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&query=' + query;
        return $http.get(movieURL)
        .then(function(response) {
            var Moviedata = response.data.results;
            return {MovieResults : Moviedata, searchQuery: query};
        });
    };
    return {
        findMovie: function (query) {
            return movieFind(query);
        }
    };
}]);

movieApp.controller('HomeController', ['$scope', '$http','$routeParams','MovieSearch','$location' ,function($scope, $http, $routeParams, MovieSearch, $location) {

    $scope.submit = function () {

        // console.log($scope.MovieSearch);
        MovieSearch.findMovie($scope.MovieSearch)
        .then(function(response) {
            var movieData = response;
            $scope.movies = movieData.MovieResults;
        });
        $location.path('/results/' + $scope.MovieSearch );


    };
}]);
movieApp.controller('ResultsController',['$scope', '$http', '$routeParams', 'MovieSearch', function($scope, $http, $routeParams,MovieSearch) {

    MovieSearch.findMovie($routeParams.Results)
    .then(function(response) {
        var movieData = response.MovieResults;
        $scope.movies = movieData;
    });
    $scope.submit = function () {

        // console.log($scope.MovieSearch);
        MovieSearch.findMovie($scope.MovieSearch)
        .then(function(response) {
            var movieData = response;
            $scope.movies = movieData.MovieResults;
        });



    };

}]);
movieApp.controller('MovieController', ['$scope', '$http','$routeParams','MovieSearch',function($scope, $http, $routeParams, MovieSearch) {

    $scope.movieName = $routeParams.name;
    console.log($scope.movieName);
    MovieSearch.findMovie($scope.movieName)
    .then(function (response) {
        var movieData = response.MovieResults;
        var background =  'https://image.tmdb.org/t/p/original' + movieData[0].backdrop_path;
        background = 'url(' + background + ')';
        document.getElementById('SpecificMovie').style.backgroundImage = background;
        console.log(movieData);
        // console.log(movieData[0]);
        var SpecificMovieData = movieData[0];
        $scope.title = SpecificMovieData.title;
        $scope.overview = SpecificMovieData.overview;
        //response.searchQuery = $scope.movieName
        // console.log(response.searchQuery);
    });

}]);
