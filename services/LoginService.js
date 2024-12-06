app.factory('LoginService', ['$http', function($http) {
    return {
        login: function(loginData) {
            return $http.post(`${endpoint}login`, loginData)
                .then(function (response) {
                    // Jika login berhasil, simpan token dan role
                    localStorage.setItem('token', response.data.token); // Simpan token
                    const decodedToken = jwt_decode(response.data.token); // Decode token untuk mendapatkan role
                    localStorage.setItem('user', JSON.stringify({ email: loginData.email, role: decodedToken.role })); // Simpan email dan role
                    localStorage.setItem('currentUserId', response.data.userId); // Simpan userId
                    
                    // Menyimpan isAdmin ke localStorage agar bisa diakses di controller lain
                    localStorage.setItem('isAdmin', decodedToken.role === 'admin');
                    
                    return { success: true };
                })
                .catch(function (error) {
                    return { success: false, message: error.data.message || 'Invalid email or password' };
                });
        }
    };
}]);
