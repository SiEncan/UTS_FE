// Define AngularJS App
const app = angular.module('uskateApp', []);

// Home Controller
app.controller('HomeController', function ($scope, $http) {
  // Data untuk skates
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

  // Cek status login dari backend
  $scope.checkLoginStatus = function () {
    $http.get('http://localhost:3000/check-login', { withCredentials: true })
      .then(function (response) {
        $scope.isLoggedIn = response.data.loggedIn; // Status login
        $scope.userEmail = response.data.email || null; // Email user jika login
      })
      .catch(function (error) {
        console.error('Error checking login status:', error);
        $scope.isLoggedIn = false;
        $scope.userEmail = null;
      });
  };

  // Panggil fungsi cek login saat halaman dimuat
  $scope.checkLoginStatus();

  // Fungsi untuk logout
  $scope.logout = function () {
    $http.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then(function (response) {
        alert(response.data.message);
        $scope.isLoggedIn = false;
        $scope.userEmail = null;
        window.location.href = 'index.html'; // Redirect ke halaman beranda setelah logout
      })
      .catch(function (error) {
        console.error('Error during logout:', error);
        alert('Logout failed.');
      });
  };

  $scope.deleteProfile = function () {
    $http.delete('http://localhost:3000/delete-profile', { withCredentials: true })
      .then(function (response) {
        alert(response.data.message);
        $scope.isLoggedIn = false;
        $scope.userProfile = null;
        window.location.href = 'index.html';
      })
      .catch(function (error) {
        console.error('Error deleting profile:', error);
        alert('Failed to delete profile.');
      });
  };
});

// Signup Controller
app.controller('SignupController', function ($scope, $http) {
  $scope.signup = function () {
    const newUser = {
      email: $scope.email,
      password: $scope.password,
    };

    $http.post('http://localhost:3000/signup', newUser)
      .then(function (response) {
        alert(response.data.message);

        // Ambil lastPage user setelah signup
        $http.get(`http://localhost:3000/get-last-page/${newUser.email}`)
          .then(function (res) {
            const lastPage = res.data.lastPage || 'index.html'; // Redirect ke halaman default jika null
            window.location.href = lastPage;
          })
          .catch(function (error) {
            console.error('Error fetching last page:', error);
            window.location.href = 'index.html'; // Redirect ke halaman default jika gagal
          });
      })
      .catch(function (error) {
        console.error('Error during signup:', error);
        alert(error.data.message || 'Error during signup');
      });
  };
});

// Save Last Page on Navigation
app.run(function ($rootScope, $http) {
  $rootScope.$on('$locationChangeSuccess', function () {
    const currentPage = window.location.href;
    const email = localStorage.getItem('userEmail'); // Ambil email user dari localStorage atau session

    if (email) {
      $http.post('http://localhost:3000/save-last-page', {
        email: email,
        lastPage: currentPage
      }).catch(function (error) {
        console.error('Error saving last page:', error);
      });
    }
  });
});

// Login Controller
app.controller('LoginController', function ($scope, $http) {
  $scope.login = function () {
    const userCredentials = {
      email: $scope.email,
      password: $scope.password,
    };

    $http.post('http://localhost:3000/login', userCredentials, { withCredentials: true })
      .then(function (response) {
        alert('Login successful');
        window.location.href = 'index.html'; // Redirect ke halaman beranda setelah login
      })
      .catch(function (error) {
        console.error('Error during login:', error);
        alert('Invalid email or password.');
      });
  };
});

