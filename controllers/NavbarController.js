app.controller('NavbarController', ['$scope', '$http', function ($scope, $http) {
    // Ambil status admin dari localStorage
    $scope.isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Periksa apakah token ada di localStorage
    $scope.isLoggedIn = !!localStorage.getItem('token');
    
    // Ambil profil pengguna dari localStorage jika tersedia
    if ($scope.isLoggedIn) {
        const userProfile = JSON.parse(localStorage.getItem('profile'));
        $scope.profile = userProfile;
        $scope.pro = {};
        // Mendapatkan token dari localStorage
        const token = localStorage.getItem('token');

        // Konfigurasi header dengan Authorization
        const config = {
            headers: {
            Authorization: `Bearer ${token}`
            }
        };

        $http.get(`${endpoint}profile`, config)
            .then(function (response) {
                $scope.pro = response.data;
            })
            .catch(function (error) {
                
            });
    }
    
    // Handle Login/Logout action
    $scope.handleAuth = function () {
        if ($scope.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('currentUserId');
            $scope.isLoggedIn = false;
            $scope.profile = null;
            
        }
    };
}]);