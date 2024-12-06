app.controller('RegisterController', ['$scope', '$window', 'RegisterService', function ($scope, $window, RegisterService) {
    // Redirect if user is already logged in
    if (localStorage.getItem('token')) {
        $window.location.href = 'profile.html';
    }

    // Initialize registerData with password and confirmPassword
    $scope.registerData = {
        name: '',
        email: '',
        password: '',
    };

    $scope.successMessage = '';
    $scope.errorMessage = '';
    $scope.passwordMismatch = false;

    // Watch for password and confirmPassword changes to validate them
    $scope.$watchGroup(['registerData.password', 'confirmPassword'], function (newValues) {
        $scope.passwordMismatch = newValues[0] !== newValues[1];
    });

    // Register function
    $scope.register = function () {
        // Don't proceed if passwords don't match
        if ($scope.passwordMismatch) {
            $scope.errorMessage = 'Passwords do not match';
            $scope.successMessage = '';
            return;
        }

        // Proceed with registration if passwords match
        RegisterService.register($scope.registerData)
            .then(function(response) {
                if (response.success) {
                    // Reset form
                    $scope.registerData = {
                        name: '',
                        email: '',
                        password: '',
                    };
                    $scope.confirmPassword = '';

                    // Show success message
                    $scope.successMessage = 'Registration successful! You can now log in.';
                    var myModal = new bootstrap.Modal(document.getElementById('successModal'));
                    myModal.show();
                } else {
                    // Show error message
                    $scope.errorMessage = response.message;
                }
            });
    };

    $scope.closeModal = function() {
        var myModal = new bootstrap.Modal(document.getElementById('successModal'));
        myModal.hide();
        $window.location.href = 'login.html';
    };
}]);