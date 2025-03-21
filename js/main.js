document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentSlide = 0;
    let slideInterval;

    // Hàm chuyển slide
    function goToSlide(n) {
        // Ẩn slide hiện tại
        slides[currentSlide].classList.remove('active');
        
        // Cập nhật index của slide hiện tại
        currentSlide = (n + slides.length) % slides.length;
        
        // Hiển thị slide mới
        slides[currentSlide].classList.add('active');
    }

    // Hàm chuyển slide tiếp theo
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Hàm chuyển slide trước đó
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Thêm sự kiện click cho nút mũi tên
    prevArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 4000);
    });

    nextArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 4000);
    });

    // Khởi động slideshow
    goToSlide(0);
    slideInterval = setInterval(nextSlide, 4000);
});