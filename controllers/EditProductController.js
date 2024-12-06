app.controller('EditProductController', ['$scope', '$http', '$window', 'ProductService', function ($scope, $http, $window, ProductService) {
    $scope.isAdmin = localStorage.getItem('isAdmin') === 'true';

    const urlParams = new URLSearchParams($window.location.search);
    const productId = urlParams.get('id');

    if (!$scope.isAdmin) {
        $window.location.href = 'index.html';
    }

    if (productId) {
        // Ambil data produk berdasarkan ID
        $http.get(`${endpoint}product/find/${productId}`)
            .then(response => {
                $scope.productDetail = response.data;
            })
            .catch(error => {
                console.error('Error getting product:', error);
                alert('Product not found or an error occurred.');
            });
    } else {
        console.error('Product ID not found in URL');
    }

     // Fungsi untuk memperbarui produk
     $scope.updateProduct = function () {
        if (!$scope.isAdmin) {
            alert('You must be an admin to update products');
            return;
        }

        if (!$scope.productDetail) return;

        ProductService.updateProduct(productId, $scope.productDetail)
            .then(response => {
                alert('Product updated successfully');
                $window.location.href = 'productview.html?id=' + productId;
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert('Error updating product');
            });
    };

    // Fungsi untuk menghapus produk
    $scope.deleteProduct = function () {
        if (!$scope.isAdmin) {
            alert('You must be an admin to delete products');
            return;
        }

        if (confirm('Are you sure you want to delete this product?')) {
            ProductService.deleteProduct(productId)
                .then(response => {
                    alert('Product deleted successfully');
                    $window.location.href = 'index.html';  // Redirect ke halaman utama setelah produk dihapus
                })
                .catch(error => {
                    alert('Error deleting product: ' + error.data.message);
                });
        }
    };
}]);