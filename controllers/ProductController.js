app.controller('ProductController', ['$scope', '$window', 'ProductService', function ($scope, $window, ProductService) {
    $scope.productDetail = null;
    $scope.relatedProducts = [];
    $scope.productsByTag = {};
    $scope.product = { title: '', image: '', description: '', color: [], price: '', tags: '' };
    $scope.isAdmin = localStorage.getItem('isAdmin') === 'true';
    $scope.colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Purple', 'Yellow', 'Orange'];
    $scope.availableTags = [
        'board', 'wheel', 'top', 'sweatshirt', 'bottom', 'headwear', 'socks'
    ];

    $scope.boards = [];
    $scope.wheels = [];
    
    $scope.tops = [];
    $scope.sweatshirts = [];
    $scope.bottoms = [];
    
    $scope.headwears = [];
    $scope.socks = [];

    $scope.goToEditPage = function(productId) {
        $window.location.href = `edit_product.html?id=${productId}`;
    };
    
    // Get product by ID
    $scope.getProductById = function () {
        const productId = new URLSearchParams($window.location.search).get('id');
        if (productId) {
            ProductService.getProductById(productId)
                .then(response => {
                    $scope.productDetail = response.data;
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });

            ProductService.getRelatedProducts(productId)
                .then(response => {
                    $scope.relatedProducts = response.data;
                })
                .catch(error => {
                    console.error('Error fetching related products:', error);
                });
        }
    };

    // Get products by tag
    $scope.getProductsByTag = function (tag, targetArray) {
        ProductService.getProductsByTag(tag)
            .then(response => {
                $scope[targetArray] = response.data;
            })
            .catch(error => {
                console.error(`Error fetching products for tag ${tag}:`, error);
            });
    };

    $scope.toggleColor = function (color) {
        const idx = $scope.product.color.indexOf(color);
        if (idx > -1) {
            $scope.product.color.splice(idx, 1); // Hapus jika sudah ada
        } else {
            $scope.product.color.push(color); // Tambahkan jika belum ada
        }
    };

    // Add new product
    $scope.addProduct = function () {
        if (!$scope.isAdmin) {
            alert('Only admins can add products.');
            return;
        }

        ProductService.addProduct($scope.product)
            .then(response => {
                alert('Product added successfully.');
                $scope.product = {};
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    $scope.initPage = function () {
                // Cek apakah halaman adalah 'add_product.html'
        const currentPage = $window.location.pathname;

        if (currentPage.includes("add_product.html") && !$scope.isAdmin) {
            // Jika bukan admin dan mengakses add_product.html, redirect ke halaman lain
            $window.location.href = 'index.html';
        } else if (currentPage.includes("productview.html")) {
            // Hanya panggil getProductById jika berada di halaman productview.html
            $scope.getProductById();

            if ($scope.isLoggedIn) {
                $scope.getHasPurchasedProduct();
            }

        } else if (currentPage.includes('shop_skate.html')) {
            // Load boards and wheels for skate page
            $scope.getProductsByTag('board', 'boards');
            $scope.getProductsByTag('wheel', 'wheels');
            
        } else if (currentPage.includes('shop_clothing.html')) {
            // Load clothing products
            $scope.getProductsByTag('top', 'tops');
            $scope.getProductsByTag('sweatshirt', 'sweatshirts');
            $scope.getProductsByTag('bottom', 'bottoms');
            
        } else if (currentPage.includes('shop_accessories.html')) {
            // Load accessories
            $scope.getProductsByTag('headwear', 'headwears');
            $scope.getProductsByTag('socks', 'socks');
        }
    };
    // Panggil fungsi inisialisasi
    $scope.initPage();
}]);