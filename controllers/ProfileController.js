app.controller('ProfileController', ['$scope', '$window', 'ProfileService', function ($scope, $window, ProfileService) {
    $scope.profile = {};
    $scope.favoriteRecipes = [];
    $scope.isLoading = true;
    $scope.errorMessage = '';

    // Periksa apakah token ada di localStorage
    $scope.isLoggedIn = !!localStorage.getItem('token');

    // Handle Login/Logout action
    $scope.handleAuth = function () {
        // Logout: Hapus token dan refresh halaman
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('currentUserId');
        $scope.isLoggedIn = false;
        window.location.href = 'index.html'; // Redirect ke halaman utama
    };

    // Mendapatkan token dari localStorage
    const token = localStorage.getItem('token');

    // Memuat data profil dari API
    ProfileService.getProfile()
        .then(function (response) {
            $scope.profile = response.data;
        })
        .catch(function (error) {
            if (error.status === 401) {
                $scope.errorMessage = 'Unauthorized. Please log in again.';
                localStorage.removeItem('token'); // Hapus token jika tidak valid
                window.location.href = 'login.html';
            } else {
                $scope.errorMessage = 'Failed to load profile data.';
            }
            $scope.isLoading = false;
        });

    $scope.updateProfile = function() {
        $scope.isLoading = true;
        const updatedProfile = {
            name: $scope.profile.name,
            email: $scope.profile.email,
        };

        ProfileService.updateProfile(updatedProfile)
            .then(function(response) {
                $scope.isLoading = false;
                alert('Profile updated successfully');
            })
            .catch(function(error) {
                $scope.isLoading = false;
                $scope.errorMessage = 'Failed to update profile';
            });
    };

    // Fungsi untuk menghapus akun
    $scope.deleteAccount = function() {
        if (confirm('Are you sure you want to delete your account?')) {
            ProfileService.deleteAccount()
                .then(function(response) {
                    alert('Your account has been deleted.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('isAdmin');
                    $window.location.href = 'login.html';  // Redirect ke halaman login
                })
                .catch(function(error) {
                    console.error('Error deleting account:', error);
                    alert('Error deleting account: ' + (error.data.message || 'Unknown error'));
                });
        }
    };
}]);
