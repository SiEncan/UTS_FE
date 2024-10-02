document.addEventListener("DOMContentLoaded", function () {
    // Ambil elemen yang dibutuhkan
    const skateLink = document.getElementById('skateLink');
    const skateDropdown = document.getElementById('skateDropdown');

    const clothingLink = document.getElementById('clothingLink');
    const clothingDropdown = document.getElementById('clothingDropdown');

    const accessoriesLink = document.getElementById('accessoriesLink');
    const accessoriesDropdown = document.getElementById('accessoriesDropdown');

    // Fungsi untuk toggle dropdown saat item diklik
    function toggleDropdown(dropdown) {
        dropdown.classList.toggle('show');
    }

    // Menangani klik pada "Skate"
    skateLink.addEventListener('click', function(event) {
        event.preventDefault(); // Cegah link menuju halaman langsung
        toggleDropdown(skateDropdown); // Toggle dropdown Skate
        clothingDropdown.classList.remove('show'); // Tutup yang lain
        accessoriesDropdown.classList.remove('show'); // Tutup yang lain
    });

    // Menangani klik pada "Clothing"
    clothingLink.addEventListener('click', function(event) {
        event.preventDefault(); // Cegah link menuju halaman langsung
        toggleDropdown(clothingDropdown); // Toggle dropdown Clothing
        skateDropdown.classList.remove('show'); // Tutup yang lain
        accessoriesDropdown.classList.remove('show'); // Tutup yang lain
    });

    // Menangani klik pada "Accessories"
    accessoriesLink.addEventListener('click', function(event) {
        event.preventDefault(); // Cegah link menuju halaman langsung
        toggleDropdown(accessoriesDropdown); // Toggle dropdown Accessories
        skateDropdown.classList.remove('show'); // Tutup yang lain
        clothingDropdown.classList.remove('show'); // Tutup yang lain
    });

    // Menutup dropdown ketika mengklik di luar dropdown
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            skateDropdown.classList.remove('show');
            clothingDropdown.classList.remove('show');
            accessoriesDropdown.classList.remove('show');
        }
    };
});
