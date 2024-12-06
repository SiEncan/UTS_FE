app.controller('LoginController', ['$scope', '$window', 'LoginService', function ($scope, $window, LoginService) {
    if(localStorage.getItem('token')) {
        $window.location.href = 'profile.html';
    }

    $scope.loginData = {
        email: '',
        password: ''
    };

    $scope.errorMessage = '';

    $scope.login = function () {
        LoginService.login($scope.loginData)
            .then(function(response) {
                if (response.success) {
                    // Menampilkan modal sukses
                    var myModal = new bootstrap.Modal(document.getElementById('successModal'));
                    myModal.show();
                } else {
                    // Menampilkan modal error
                    $scope.errorMessage = response.message;
                    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                    errorModal.show();
                }
            });
    };

    $scope.closeModal = function() {
        var myModal = new bootstrap.Modal(document.getElementById('successModal'));
        myModal.hide();
        $window.location.href = 'index.html';
    };
    
    $scope.closeErrorModal = function() {
        var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.hide();
    };
}]);
