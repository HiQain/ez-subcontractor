$(document).ready(function () {
    // 🔹 Password field toggle
    var $passwordInput = $('#password');
    var $toggleIcon = $('#toggleIcon');

    $toggleIcon.on('click', function () {
        var isPassword = $passwordInput.attr('type') === 'password';
        $passwordInput.attr('type', isPassword ? 'text' : 'password');
        $toggleIcon.toggleClass('bi-eye bi-eye-slash');
    });

    // 🔹 Confirm Password field toggle
    var $confirmInput = $('#confirm_password');
    var $toggleConfirmIcon = $('#toggleConfirmIcon');

    $toggleConfirmIcon.on('click', function () {
        var isPassword = $confirmInput.attr('type') === 'password';
        $confirmInput.attr('type', isPassword ? 'text' : 'password');
        $toggleConfirmIcon.toggleClass('bi-eye bi-eye-slash');
    });
});


// Number
$(document).ready(function () {
    var $input = $("#phone");

    // Initialize intl-tel-input
    var iti = window.intlTelInput($input[0], {
        initialCountry: "pk", // 🇵🇰 Default Pakistan
        nationalMode: true, // number without +92 in placeholder
        autoPlaceholder: "polite",
        preferredCountries: ["pk", "in", "ae", "us", "gb"], // optional
        formatOnDisplay: true,
        separateDialCode: true, // 👈 flag ke sath +code show karega
    });

    // Only allow numbers
    $input.on("keypress", function (e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Update placeholder when country changes
    $input.on("countrychange", function () {
        var placeholder = $input.attr("placeholder");
        $input.attr("placeholder", placeholder);
    });
});


// JQuery code ko DOM ready hone par chalao
$(document).ready(function () {

    // --- Hamburger Click Functionality ---
    $("#hamburger-icon").on("click", function () {
        // Hamburger icon ki 'open' class ko toggle karega (X/Burger)
        $(this).toggleClass("open");

        // Navigation menu ko smooth tareeqay se show/hide karega
        $(".header nav").stop(true, true).slideToggle(300);
    });

    // --- Window Resize Functionality ---
    $(window).on("resize", function () {
        // Current window width check karein
        let windowWidth = $(window).width();

        if (windowWidth > 992) {
            // Jab Desktop Size (> 992px) ho:

            // 1. Navigation ko hamesha dikhao (CSS Media Query ko override karega agar slideToggle use hua ho)
            $(".header nav").show();

            // 2. Hamburger icon se 'open' class hata do (taake wo wapis Hamburger ban jaaye)
            $("#hamburger-icon").removeClass("open");

        }
        // ⚠️ ELSE BLOCK HATA DIYA HAI:
        // Ab agar screen size 992px se kam hai aur resize hota hai, 
        // toh icon aur nav ki maujooda (current) haalat (state) mein koi tabdeeli nahi aayegi.
        // Yani, agar menu open hai (X bana hua hai), toh woh open hi rahega.
    });

    // Initial Load par bhi check karein ke agar desktop size hai toh nav dikhe
    if ($(window).width() > 992) {
        $(".header nav").show();
    }
});

// See More + Slider

$(document).ready(function () {
  // -------- HERO SLIDER INIT --------
  $('.hero-service-slide').slick({
    slidesToShow: 3, // apne hisaab se number set karo
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: true,
    speed: 600,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { arrows: false, autoplay: true, autoplaySpeed: 3000, slidesToShow: 1 } }
    ]
  });

  // -------- SEE MORE (FULLY FIXED FOR SLICK) --------
  function initSeeMore() {
    $('.custom-card').each(function () {
      var $desc = $(this).find('.description');
      var $btn = $(this).find('.see-more-btn');

      if (!$desc.length) return;

      // Agar button exist nahi karta, create kar do
      if (!$btn.length) {
        $btn = $('<button class="see-more-btn">See more</button>');
        $desc.after($btn);
      }

      // Reset
      $desc.removeClass('expanded');
      $btn.text('See more').hide();

      // Check height with small delay (for cloned or lazy slides)
      setTimeout(() => {
        var lineHeight = parseFloat($desc.css('line-height')) || 20;
        var maxHeight = lineHeight * 3;

        if ($desc[0].scrollHeight > maxHeight + 5) {
          $btn.show();
        }
      }, 100);

      // Toggle logic
      $btn.off('click').on('click', function () {
        if ($desc.hasClass('expanded')) {
          $desc.removeClass('expanded');
          $(this).text('See more');
        } else {
          $desc.addClass('expanded');
          $(this).text('See less');
        }
      });
    });
  }

  // Run initially
  initSeeMore();

  // Re-run after every slick slide change
  $('.hero-service-slide').on('afterChange', function () {
    initSeeMore();
  });

  // Also re-run after slick init completes (to catch hidden clones)
  $('.hero-service-slide').on('setPosition', function () {
    initSeeMore();
  });
});






// Main Card Slide

$(document).ready(function () {
    var $slider = $('.main-card-slide');
    var $pagination = $('.custom-pagination');

    // Initialize Slick (no default dots)
    $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 600,
        responsive: [
            {
                breakpoint: 992,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    });

    // Total slides count
    var totalSlides = $slider.slick('getSlick').slideCount;

    // Create dots equal to total slides
    for (var i = 0; i < totalSlides; i++) {
        $pagination.append('<div class="page-dot" data-index="' + i + '"></div>');
    }

    // Activate first dot
    $pagination.find('.page-dot').eq(0).addClass('active');

    // On dot click → move to that exact slide
    $pagination.on('click', '.page-dot', function () {
        var index = $(this).data('index');
        $slider.slick('slickGoTo', index);
    });

    // Update active dot when slide changes
    $slider.on('afterChange', function (event, slick, currentSlide) {
        $pagination.find('.page-dot').removeClass('active');
        $pagination.find('.page-dot').eq(currentSlide).addClass('active');
    });
});


// Review Slider

$(document).ready(function () {
    $('.review-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 600,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    });
});

// Pricing

$(document).ready(function () {
    $(".tab-btn").on("click", function () {
        // Active tab styling
        $(".tab-btn").removeClass("active");
        $(this).addClass("active");

        // Show relevant pricing content
        const target = $(this).data("target");
        $(".pricing-content").removeClass("active");
        $("#" + target).addClass("active");
    });
});


// Select 2

$(document).ready(function () {
  $('.custom-select').each(function () {
    var $select = $(this);
    var $selected = $select.find('.select-selected');
    var $options = $select.find('.select-options li');

    // Toggle dropdown open/close
    $selected.on('click', function (e) {
      e.stopPropagation();
      $('.custom-select').not($select).removeClass('open');
      $select.toggleClass('open');
    });

    // Select option
    $options.on('click', function () {
      var value = $(this).data('value');
      var text = $(this).text();

      $options.removeClass('selected');
      $(this).addClass('selected');

      $selected.text(text);
      $select.removeClass('open');
    });

    // Close dropdown on outside click
    $(document).on('click', function () {
      $select.removeClass('open');
    });
  });
});


// Dashboard Slider

$(document).ready(function () {
  var $slider = $('.main-slider');

  $slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: true,
    speed: 600,
    prevArrow: $('.custom-prev'),
    nextArrow: $('.custom-next'),
  });
});

// filter bar

$(document).ready(function () {
  var $range = $('#milesRange');
  var $bubble = $('.range-value');

  function updateValue() {
    var val = $range.val();
    var min = $range.attr('min');
    var max = $range.attr('max');
    var percent = ((val - min) / (max - min)) * 100;

    $bubble.text(val + ' miles');
    $bubble.css('left', 'calc(' + percent + '% + (' + (8 - percent * 0.15) + 'px))');
  }

  $range.on('input change', updateValue);
  updateValue(); // initial call
});


// See more again






