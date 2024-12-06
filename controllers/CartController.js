app.controller('CartController', function($scope, CartService) {
    $scope.isLoggedIn = !!localStorage.getItem('token');

    $scope.quantity = 1;  // Set default quantity
    $scope.increaseQuantity = function () {
        $scope.quantity = ($scope.quantity || 1) + 1; // Memastikan quantity selalu ada (minimal 1)
    };

    // Fungsi untuk mengurangi quantity
    $scope.decreaseQuantity = function () {
        if ($scope.quantity > 1) {
            $scope.quantity -= 1;
        }
    };
    
    // Ambil cart items

    if ($scope.isLoggedIn) {
        CartService.getCartItems().then(function(cartItems) {
            $scope.cartItems = cartItems;
            $scope.cartItemCount = CartService.getCartItemCount(cartItems);
        });
    }

    // Fungsi untuk menambah item ke cart
    $scope.addToCart = function(item) {
        CartService.addToCart(item.productId._id, 1).then(response => {
            $scope.cartItems = response.data.cart;
            $scope.cartItemCount = CartService.getCartItemCount($scope.cartItems);
        });
    };

    $scope.addToCartWithQuantity = function (product, quantity) {
        // Pastikan quantity diambil dari parameter yang diterima
        if (!quantity || quantity <= 0) {
            quantity = 1; // Jika quantity invalid, set default ke 1
        }

        // Pastikan user terotentikasi
        if (!$scope.isLoggedIn) {
            alert('Please login to buy product.');
            return;
        }

        // Panggil service untuk menambahkan produk ke keranjang
        CartService.addToCart(product._id, quantity)
            .then(response => {
                alert('Product added to cart!');
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
                alert('Error adding product to cart: ' + (error.data?.message || 'Unknown error'));
            });
    };

    // Fungsi untuk mengurangi item dari cart
    $scope.removeFromCart = function(item) {
        CartService.removeFromCart(item.productId._id).then(function(response) {
            $scope.cartItems = response.data.cart;
            $scope.cartItemCount = CartService.getCartItemCount($scope.cartItems);
        });
    };

    $scope.getTotal = function() {
        return $scope.cartItems.reduce(function(total, item) {
            return total + (item.quantity * item.productId.price);
        }, 0);
    };

    $scope.checkout = function() {
        CartService.checkout();        
    };
});