app.factory('ProfileService', ['$http', function ($http) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    return {
        getProfile: function () {
            return $http.get(`${endpoint}profile`, { headers });
        },
        updateProfile: function (updatedProfile) {
            return $http.put(`${endpoint}profile`, updatedProfile, { headers });
        },
        deleteAccount: function () {
            return $http.delete(`${endpoint}profile/delete`, { headers });
        }
    };
}]);
