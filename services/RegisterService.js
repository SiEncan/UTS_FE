app.factory('RegisterService', ['$http', function($http) {
    return {
        register: function(registerData) {
            return $http.post(`${endpoint}register`, registerData)
                .then(function(response) {
                    return { success: true };
                })
                .catch(function(error) {
                    return { 
                        success: false,
                        message: error.data.error || 'Registration failed. Please try again.'
                    };
                });
        }
    };
}]);
