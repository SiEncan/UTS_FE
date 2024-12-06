app.factory('CartService', function ($http, $window) {
    var endpoint = 'http://localhost:3009/api/';
    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return {
        // Mendapatkan cart items
        getCartItems: function() {
            return $http.get(`${endpoint}cart/items`, config).then(function(response) {
                return response.data.cart || [];
            });
        },
        
        // Menambahkan item ke cart atau update quantity
        addToCart: function(productId, quantity) {
            return $http.post(`${endpoint}cart/add`, { productId, quantity }, config);
        },

        // Menghapus item atau mengurangi quantity
        removeFromCart: function(productId) {
            return $http.post(`${endpoint}cart/remove`, { productId }, config);
        },

        // Menghitung total jumlah item di cart
        getCartItemCount: function(cartItems) {
            return cartItems.reduce(function(total, item) {
                return total + item.quantity;
            }, 0);
        },

        checkout: function() {
            return $http.post(`${endpoint}cart/checkout`, {}, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            .then(function(response) {
                alert('Checkout successful!');
                $window.location.href = 'index.html'; // Redirect ke halaman riwayat pesanan
            })
            .catch(function(error) {
                alert('Error during checkout');
                console.error(error);
            });

        }
    };
});