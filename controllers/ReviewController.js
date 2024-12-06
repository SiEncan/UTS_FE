app.controller('ReviewController', ['$scope', 'ReviewService', 'ProductService', '$window', function ($scope, ReviewService, ProductService, $window) {
    const token = localStorage.getItem('token');
    $scope.currentUserId = localStorage.getItem('currentUserId');
    // Konfigurasi header dengan Authorization
    const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }
    }
    
    $scope.newReview = { rating: 0, comment: '' };
    $scope.isLoggedIn = !!localStorage.getItem('token');
    
    $scope.newReview = {
        rating: 0,
        comment: ''
    };
    
    $scope.setRating = function(rating) {
        $scope.newReview.rating = rating;
    };

    $scope.updateReviewRating = function (review, newRating) {
        review.rating = newRating; // Perbarui rating di lokal
    };    

    $scope.editReview = function(reviewId) {
        // Temukan review berdasarkan ID
        const review = $scope.productDetail.reviews.find(r => r._id === reviewId);
        
        if (review) {
            review.isEditing = true;  // Menandakan bahwa review ini sedang dalam mode editing
        }
    };

    $scope.cancelEdit = function(reviewId) {
        const review = $scope.productDetail.reviews.find(r => r._id === reviewId);
        
        if (review) {
            review.isEditing = false;  // Batalkan mode editing
        }
        $scope.refreshProductData($scope.productDetail._id);
    };
    
    // Periksa apakah pengguna sudah memberikan review
    $scope.userHasReviewed = false;
    $scope.checkIfUserHasReviewed = function() {
        $scope.userHasReviewed = $scope.productDetail.reviews.some(function(review) {
            return review.userId._id.toString() === $scope.currentUserId.toString();
        });
    };  

    $scope.$watch('productDetail', function(newVal) {
        if (newVal && $scope.isLoggedIn) {
            $scope.checkIfUserHasReviewed();
        }
    });


    $scope.hasPurchasedProduct = false;
    $scope.getHasPurchasedProduct = function () {
        if ($scope.isLoggedIn) {
            const urlParams = new URLSearchParams($window.location.search);
            const productId = urlParams.get('id');

            if (productId) {
                ProductService.getPurchasedProducts(config)
                    .then(response => {
                        $scope.hasPurchasedProduct = response.data.some(item => item.productId._id === productId);
                    })
                    .catch(error => {
                        console.error('Error checking purchased products:', error);
                    });
            }
        }
    };
                    
    // Add review
    $scope.addReview = function () {
        if (!$scope.isLoggedIn) {
            alert('You must be logged in to leave a review');
            return;
        }

        if (!$scope.hasPurchasedProduct) {
            alert('You must purchase this product to leave a review');
            return;
        }

        if (!$scope.newReview.rating || !$scope.newReview.comment) {
            alert('Please provide both a rating and a comment.');
            return;
        }

        if ($scope.userHasReviewed) {
            alert('You can’t write a review twice!');
            return;
        }

        const productId = $scope.productDetail._id;
        const reviewData = {
            userId: $scope.currentUserId, // Kirim userId yang disimpan di localStorage
            rating: $scope.newReview.rating,
            comment: $scope.newReview.comment,
        };

        ReviewService.addReview(productId, reviewData)
            .then(response => {
                alert('Review submitted successfully!');
                // Tambahkan review baru ke daftar review produk
                $scope.productDetail.reviews.push(response.data.newReview);
                $scope.newReview = {};  // Reset form
                $scope.refreshProductData(productId);
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                alert('Error submitting review: ' + (error.data?.message || 'Unknown error'));
            });
    };
                
    // Update review
    $scope.updateReview = function (reviewId) {
        // Cari review berdasarkan ID
        const review = $scope.productDetail.reviews.find(r => r._id === reviewId);
        const productId = $scope.productDetail._id;

        // Pastikan user tidak bisa mengedit review milik user lain
        if (review.userId._id.toString() !== $scope.currentUserId.toString()) {
            alert('You can`t update other people`s review');
            return;
        }

        if (review) {
            // Data review yang sudah diubah
            const updatedReview = {
                comment: review.comment, // Komentar yang sudah diubah
                rating: review.rating    // Rating yang sudah diubah
            };

            // Panggil service untuk memperbarui review di backend
            ReviewService.updateReview(productId, review._id, updatedReview)
                .then(response => {
                    review.isEditing = false; // Matikan mode editing setelah berhasil
                    alert('Review updated successfully!');
                })
                .catch(error => {
                    console.error('Error updating review:', error);
                    alert('Error updating review.');
                });
        }
    };

    // Delete review
    $scope.deleteReview = function (reviewId) {
        const productId = $scope.productDetail._id;

        // Cari review berdasarkan ID
        const review = $scope.productDetail.reviews.find(review => review._id === reviewId);

        // Periksa apakah pengguna saat ini adalah pemilik review
        if (!review || review.userId._id.toString() !== $scope.currentUserId.toString()) {
            alert('You can`t delete other people`s review');
            return;
        }

        // Panggil service untuk menghapus review
        ReviewService.deleteReview(productId, reviewId)
            .then(response => {
                // Hapus review dari daftar jika berhasil
                alert('Review deleted successfully!');
                $scope.refreshProductData(productId); // Segarkan data produk
            })
            .catch(error => {
                console.error('Error deleting review:', error);
                alert('Error deleting review: ' + (error.data?.message || 'Unknown error'));
            });
    };

    $scope.refreshProductData = function(productId) {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        ProductService.getProductById(productId)
        .then(response => {
            $scope.productDetail = response.data;
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
    };

    $scope.initPage = function () {
        // Cek apakah halaman adalah 'add_product.html'
        const currentPage = $window.location.pathname;

        if (currentPage.includes("productview.html")) {

            if ($scope.isLoggedIn) {
                $scope.getHasPurchasedProduct();
            }

        }
    };
    // Panggil fungsi inisialisasi
    $scope.initPage();
}]);
