// Initialize AOS (Animate On Scroll) - Only if AOS is loaded
if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }
  
  // Wait for jQuery to be loaded
  function initializeWhenJQueryReady() {
    if (typeof $ === "undefined") {
      // If jQuery is not loaded yet, wait a bit and try again
      setTimeout(initializeWhenJQueryReady, 100);
      return;
    }
  
    $(document).ready(function () {
      // Quick View Modal Logic (event delegation for dynamic content)
      $(document).on("click", ".quick-view-btn", function () {
        const modal = $("#quickViewModal");
        modal.find(".modal-title").text($(this).data("title"));
        modal.find(".modal-body img").attr("src", $(this).data("img"));
        modal.find(".modal-body p").text($(this).data("description"));
      });
  
      // পেজ লোডে All বাটন active
      $(".btn-outline-primary").addClass("active");
  
      // Product Filtering Logic for products.html
      const $filterBtns = $(
        ".btn-outline-primary, .btn-outline-success, .btn-outline-warning, .btn-outline-info"
      );
      $filterBtns.on("click", function () {
        $filterBtns.removeClass("active");
        $(this).addClass("active");
        const filter = $(this).text().trim().toLowerCase();
        $(".row.g-4 > div").each(function () {
          const cat = ($(this).attr("data-category") || "").toLowerCase();
          if (filter === "all" || cat === filter) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
  
      // View More functionality for product categories
      $(".view-more-btn").on("click", function () {
        const grid = $($(this).data("target"));
        grid.find(".product-img-card.d-none").removeClass("d-none");
        $(this).hide();
      });
  
      // স্পোর্টস বাটনে ক্লিক করলে অটো-স্লাইড বন্ধ
      $(".sports-btn").on("click", function () {
        heroAutoSlide = false;
        const sport = $(this).data("sport");
        heroIndex = heroKeys.indexOf(sport);
        showHeroSlide(heroIndex);
      });
  
      // পেজ লোডে প্রথম স্লাইড দেখাও ও অটো-স্লাইড চালু করো
      showHeroSlide(heroIndex);
      heroAutoSlide = true;
      startHeroSlider();
  
      // Fabric Modal Functionality
      $(document).on("click", ".fabric-card", function () {
        const fabricType = $(this).data("fabric");
        const fabric = fabricData[fabricType];
  
        if (fabric) {
          $("#fabricModalImage").attr("src", fabric.image);
          $("#fabricModalTitle").text(fabric.title);
          $("#fabricModalDescription").text(fabric.description);
  
          // Update specifications
          const specsList = $("#fabricModalSpecs");
          specsList.empty();
          fabric.specs.forEach((spec) => {
            specsList.append(
              `<li class="mb-1"><i class="fa-solid fa-check text-success me-2"></i>${spec}</li>`
            );
          });
  
          // Update features
          const featuresList = $("#fabricModalFeatures");
          featuresList.empty();
          fabric.features.forEach((feature) => {
            featuresList.append(
              `<li class="mb-1"><i class="fa-solid fa-star text-warning me-2"></i>${feature}</li>`
            );
          });
        }
      });
  
      // Products Page Filtering
      $(document).on("click", ".filter-btn", function () {
        const filter = $(this).data("filter");
  
        // Update active button
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
  
        // Filter products
        if (filter === "all") {
          $(".product-item").fadeIn(300);
        } else {
          $(".product-item").fadeOut(300);
          $(`.product-item[data-category="${filter}"]`).fadeIn(300);
        }
      });
  
      // Load More Button Click Event
      $(document).on("click", ".load-more-btn", function () {
        loadMoreProducts();
      });
  
      // Order Modal Functionality
      // Quantity controls
      $("#qtyPlus").click(function () {
        let qty = parseInt($("#orderQty").val());
        $("#orderQty").val(qty + 1);
        updateTotal();
      });
  
      $("#qtyMinus").click(function () {
        let qty = parseInt($("#orderQty").val());
        if (qty > 10) {
          $("#orderQty").val(qty - 1);
          updateTotal();
        }
      });
  
      // Update total when quantity changes
      $("#orderQty").on("input", function () {
        updateTotal();
      });
  
      function updateTotal() {
        let qty = parseInt($("#orderQty").val());
        let pricePerPiece =
          parseInt($("#orderTotal").text().replace("৳", "")) / 10;
        let total = qty * pricePerPiece;
        $("#orderTotal").text("৳" + total);
      }
  
      // Order form submission
      $("#orderForm").submit(function (e) {
        e.preventDefault();
  
        // Show success message
        $("#orderForm").addClass("d-none");
        $("#orderSuccess").removeClass("d-none");
  
        // Reset form after 3 seconds
        setTimeout(function () {
          $("#orderForm").removeClass("d-none");
          $("#orderSuccess").addClass("d-none");
          $("#orderModal").modal("hide");
        }, 3000);
      });
    });
  }
  
  // Start the initialization
  initializeWhenJQueryReady();
  
  // Dynamic Hero Banner Content
  const heroData = {
    football: {
      bg: "images/200__Create_a_wide_panoramic_digital_painting_showing_football_player_7061bda4-48b0-404b-b840-1940f53a7c87.png",
      title: "DESIGN YOUR OWN\nCUSTOM FOOTBALL JERSEYS",
      desc: "Create your personalised jersey with our 3D football kit designer.",
    },
    cricket: {
      bg: "images/cricket_.png",
      title: "DESIGN YOUR OWN\nCUSTOM CRICKET JERSEYS",
      desc: "Create your custom cricket jersey with our 3D kit designer.",
    },
    basketball: {
      bg: "images/women_volleyball.png",
      title: "DESIGN YOUR OWN\nBASKETBALL JERSEYS",
      desc: "Personalize your basketball kit with our 3D configurator.",
    },
    volleyball: {
      bg: "images/volleyball_.png",
      title: "DESIGN YOUR OWN\nVOLLEYBALL JERSEYS",
      desc: "Create your unique volleyball jersey in minutes.",
    },
    custom: {
      bg: "images/curtom_jersey.jpg", // আপনার custom ডিজাইনের ইমেজ দিন
      title: "MAKE YOUR OWN\nCUSTOM JERSEY DESIGN",
      desc: "Upload your logo, pick your colors, and get a unique jersey just for you!",
    },
  };
  
  // Hero slider variables
  const heroKeys = Object.keys(heroData);
  let heroIndex = 0;
  let heroInterval = null;
  let heroAutoSlide = true;
  
  function showHeroSlide(idx) {
    if (typeof $ === "undefined") return; // Exit if jQuery not loaded
  
    const key = heroKeys[idx];
    const data = heroData[key];
    const $hero = $("#dynamic-hero");
    const $title = $(".hero-title");
    const $desc = $(".hero-desc");
  
    // পুরনো bg-এর জন্য .kenburns-bg.out
    $hero.find(".kenburns-bg").addClass("out");
  
    // নতুন bg ইনসার্ট
    const $newBg = $('<div class="kenburns-bg"></div>').css(
      "background-image",
      `url('${data.bg}')`
    );
    $hero.prepend($newBg);
  
    // টাইটেল/ডেস্ক্রিপশন আপডেট
    $title.html(data.title.replace(/\n/g, "<br>"));
    $desc.text(data.desc);
  
    // পুরনো bg রিমুভ (animation শেষে)
    setTimeout(() => {
      $hero.find(".kenburns-bg.out").remove();
    }, 800);
  
    // স্পোর্টস বাটন active
    $(".sports-btn").removeClass("active");
    $(`.sports-btn[data-sport='${key}']`).addClass("active");
  }
  
  function startHeroSlider() {
    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
      if (!heroAutoSlide) return;
      heroIndex = (heroIndex + 1) % heroKeys.length;
      showHeroSlide(heroIndex);
    }, 3000); // ৩ সেকেন্ড
  }
  
  // Move these inside the jQuery ready function
  // They will be called from within the document.ready function
  
  // Fabric Modal Data
  const fabricData = {
    "dry-fit": {
      title: "Dry-FIT Emboss Fabric",
      image: "images/Box_Mash_WhatsApp_Image_2025-07-09_at_20.25.22_11c4ac14.jpg",
      description:
        "Premium dry-fit emboss fabric perfect for sports jerseys. This high-quality material provides excellent moisture management and comfort during intense physical activities.",
      specs: [
        "Weight: 170-180 GSM",
        "Material: Polyester Blend",
        "Finish: Embossed",
        "Breathability: High",
        "Moisture Management: Excellent",
      ],
      features: [
        "Quick-drying technology",
        "Anti-odor properties",
        "UV protection",
        "Lightweight and comfortable",
        "Durable and long-lasting",
      ],
    },
    polyester: {
      title: "Polyester Blend Fabric",
      image:
        "images/Leaf_Jackard_WhatsApp_Image_2025-07-09_at_20.25.25_5095890c.jpg",
      description:
        "High-quality polyester blend fabric designed for maximum comfort and performance. Ideal for team sports and athletic wear.",
      specs: [
        "Weight: 180 GSM",
        "Material: Polyester Blend",
        "Finish: Smooth",
        "Elasticity: Medium",
        "Durability: High",
      ],
      features: [
        "Excellent color retention",
        "Easy to maintain",
        "Wrinkle-resistant",
        "Cost-effective",
        "Team-friendly pricing",
      ],
    },
    mesh: {
      title: "Sport Mesh Fabric",
      image:
        "images/Mash_Pinnole_WhatsApp_Image_2025-07-09_at_20.25.25_bccdf41f.jpg",
      description:
        "Breathable sport mesh fabric perfect for ventilation and airflow. This lightweight material keeps players cool and comfortable.",
      specs: [
        "Weight: 160 GSM",
        "Material: Mesh Polyester",
        "Finish: Mesh",
        "Breathability: Excellent",
        "Weight: Lightweight",
      ],
      features: [
        "Maximum airflow",
        "Lightweight design",
        "Quick-drying",
        "Comfortable fit",
        "Perfect for hot weather",
      ],
    },
    plain: {
      title: "Plain Polyester Fabric",
      image:
        "images/Plain_Polyster_WhatsApp_Image_2025-07-09_at_20.25.24_a4c1154e.jpg",
      description:
        "Durable plain polyester fabric suitable for all types of sports jerseys. Offers great value and long-lasting performance.",
      specs: [
        "Weight: 175 GSM",
        "Material: 100% Polyester",
        "Finish: Plain",
        "Durability: Very High",
        "Cost: Budget-friendly",
      ],
      features: [
        "Highly durable",
        "Easy to print on",
        "Budget-friendly",
        "Suitable for all sports",
        "Long-lasting colors",
      ],
    },
  };
  
  // Fabric Modal Functionality and Products Page Filtering will be moved inside jQuery ready function
  
  // Quick View Modal Function

  function openQuickView(title, image, description) {
    if (typeof $ === "undefined") return; // Exit if jQuery not loaded
  
    const modal = `
      <div class="modal fade" id="quickViewModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <img src="${image}" class="img-fluid rounded" alt="${title}">
                </div>
                <div class="col-md-6">
                  <h6 class="fw-bold mb-3">Product Details</h6>
                  <p class="text-muted">${description}</p>
                  <div class="product-features mt-3">
                    <h6 class="fw-bold mb-2">Features:</h6>
                    <ul class="list-unstyled">
                      <li><i class="fa-solid fa-check text-success me-2"></i>Premium Quality Fabric</li>
                      <li><i class="fa-solid fa-check text-success me-2"></i>Customizable Design</li>
                      <li><i class="fa-solid fa-check text-success me-2"></i>Fast Delivery</li>
                      <li><i class="fa-solid fa-check text-success me-2"></i>Team Discounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <a href="https://wa.me/8801?text=Hi! I'm interested in ${title}. Can you tell me more?" target="_blank" class="btn btn-success">
                <i class="fa-brands fa-whatsapp me-2"></i>Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // Remove existing modal if any
    $("#quickViewModal").remove();
  
    // Add new modal to body
    $("body").append(modal);
  
    // Show modal
    $("#quickViewModal").modal("show");
  }
  
  // Order Modal Function
  function openOrderModal(itemName, price) {
    if (typeof $ === "undefined") return; // Exit if jQuery not loaded
  
    $("#orderItemName").val(itemName);
    $("#orderTotal").text(`৳${price * 10}`); // Default 10 pieces
  
    // Show modal
    $("#orderModal").modal("show");
  }
  
  // Load More Products Function
  let currentProducts = 8; // Initial products shown
  const totalProducts = 20; // Total products available
  
  function loadMoreProducts() {
    if (typeof $ === "undefined") return; // Exit if jQuery not loaded
  
    const productsToAdd = 12; // Add 12 more products (3 rows)
  
    if (currentProducts >= totalProducts) {
      $(".load-more-btn").text("All Products Loaded").prop("disabled", true);
      return;
    }
  
    // Show loading state
    $(".load-more-btn")
      .html('<i class="fa-solid fa-spinner fa-spin me-2"></i>Loading...')
      .prop("disabled", true);
  
    // Simulate loading delay
    setTimeout(() => {
      // Add new products
      for (
        let i = currentProducts + 1;
        i <= Math.min(currentProducts + productsToAdd, totalProducts);
        i++
      ) {
        const category = getRandomCategory();
        const product = generateProductCard(i, category);
        $(".products-grid .row").append(product);
      }
  
      currentProducts += productsToAdd;
  
      // Update button text
      if (currentProducts >= totalProducts) {
        $(".load-more-btn").text("All Products Loaded").prop("disabled", true);
      } else {
        $(".load-more-btn")
          .html('<i class="fa-solid fa-plus me-2"></i>Load More Products')
          .prop("disabled", false);
      }
  
      // Reinitialize AOS for new elements
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, 1000);
  }
  
  function getRandomCategory() {
    const categories = [
      "football",
      "cricket",
      "basketball",
      "volleyball",
      "custom",
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }
  
  function generateProductCard(index, category) {
    const products = {
      football: [
        {
          name: "Football Jersey Pro",
          price: 680,
          image: "images/football_pro.jpeg",
        },
        {
          name: "Football Jersey",
          price: 720,
          image: "images/football_720.jpeg",
        },
        {
          name: "Football Jersey Classic",
          price: 590,
          image: "images/37_JERSEY_FUTSAL_DENIM_FULL_PRINT.jpeg",
        },
      ],
      cricket: [
        {
          name: "Cricket Jersey",
          price: 650,
          image: "images/15_download__4_.jpeg",
        },
        {
          name: "Cricket Jersey Premier",
          price: 580,
          image: "images/18_download__7_.jpeg",
        },
        {
          name: "Cricket Jersey Team Edition",
          price: 610,
          image: "images/cricket_610.jpeg",
        },
      ],
      basketball: [
        {
          name: "Basketball Jersey Pro",
          price: 620,
          image: "images/55_sublimation_jersey_degsin__1_.jpeg",
        },
        {
          name: "Basketball Jersey Elite",
          price: 680,
          image: "images/44_konsep_Jersey_depan.jpeg",
        },
        {
          name: "Basketball Jersey",
          price: 640,
          image: "images/55_sublimation_jersey_degsin__1_.jpeg",
        },
      ],
      volleyball: [
        {
          name: "Volleyball Jersey Pro",
          price: 560,
          image: "images/20_download__10_.jpeg",
        },
        {
          name: "Volleyball Jersey Elite",
          price: 590,
          image: "images/69_volleyball.jpg",
        },
        {
          name: "Volleyball Jersey Team",
          price: 540,
          image: "images/69_volleyball.jpg",
        },
      ],
      custom: [
        {
          name: "Custom Jersey Premium",
          price: 750,
          image: "images/curtom_jersey.jpg",
        },
        {
          name: "Custom Jersey Elite",
          price: 800,
          image: "images/1_curtom_design.jpg",
        },
        {
          name: "Custom Jersey Pro",
          price: 720,
          image: "images/curtom_jersey.jpg",
        },
      ],
    };
  
    const categoryProducts = products[category];
    const product =
      categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
  
    return `
      <div class="col-sm-6 col-md-4 col-lg-3 product-item" data-category="${category}" data-aos="fade-up">
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" class="img-fluid" alt="${product.name}">
            <div class="product-overlay">
              <div class="overlay-buttons">
                <button class="btn btn-light btn-sm me-2" onclick="openOrderModal('${product.name}', ${product.price})">
                  <i class="fa-solid fa-cart-plus"></i> Order
                </button>
                <button class="btn btn-outline-light btn-sm" onclick="openQuickView('${product.name}', '${product.image}', 'Premium quality jersey with excellent comfort and durability.')">
                  <i class="fa-solid fa-eye"></i> View
                </button>
              </div>
            </div>
            <div class="product-badge">New</div>
          </div>
          <div class="product-info">
            <h5 class="product-title">${product.name}</h5>
            <div class="product-price">
              <span class="current-price">৳ ${product.price}</span>
              <span class="price-unit">per piece</span>
            </div>
            <div class="product-meta">
              <span class="min-order"><i class="fa-solid fa-users me-1"></i>Min: 10 pcs</span>
              <span class="delivery-time"><i class="fa-solid fa-clock me-1"></i>3-5 days</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Fade-in animation for .fabric-item when in viewport
  function fadeInFabricItems() {
    const items = document.querySelectorAll(".fabric-item");
    const windowHeight = window.innerHeight;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < windowHeight - 40) {
        item.style.animationPlayState = "running";
      }
    });
  }
  window.addEventListener("scroll", fadeInFabricItems);
  window.addEventListener("load", fadeInFabricItems);
  
  // Scrolling Jerseys arrow button functionality
  window.addEventListener("DOMContentLoaded", function () {
    const scrollingWrapper = document.querySelector(".scrolling-wrapper");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    if (scrollingWrapper && leftArrow && rightArrow) {
      leftArrow.addEventListener("click", function () {
        scrollingWrapper.scrollBy({ left: -200, behavior: "smooth" });
      });
      rightArrow.addEventListener("click", function () {
        scrollingWrapper.scrollBy({ left: 200, behavior: "smooth" });
      });
  
      // Auto-scroll functionality
      let autoScroll = setInterval(() => {
        scrollingWrapper.scrollBy({ left: 1, behavior: "auto" });
        // Loop back to start if at end
        if (
          scrollingWrapper.scrollLeft + scrollingWrapper.clientWidth >=
          scrollingWrapper.scrollWidth - 1
        ) {
          scrollingWrapper.scrollLeft = 0;
        }
      }, 20);
  
      // Pause auto-scroll on hover
      scrollingWrapper.addEventListener("mouseenter", () =>
        clearInterval(autoScroll)
      );
      scrollingWrapper.addEventListener("mouseleave", () => {
        autoScroll = setInterval(() => {
          scrollingWrapper.scrollBy({ left: 1, behavior: "auto" });
          if (
            scrollingWrapper.scrollLeft + scrollingWrapper.clientWidth >=
            scrollingWrapper.scrollWidth - 1
          ) {
            scrollingWrapper.scrollLeft = 0;
          }
        }, 20);
      });
    }
  });
  
  // Gallery filter functionality
  window.addEventListener("DOMContentLoaded", function () {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active from all
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.getAttribute("data-filter");
        galleryItems.forEach((item) => {
          if (filter === "all" || item.classList.contains(filter)) {
            item.classList.remove("hide");
          } else {
            item.classList.add("hide");
          }
        });
      });
    });
  });
  
  // Order Modal Logic - Only if Bootstrap Modal is available
  let orderModal = null;
  let currentItem = "";
  let currentPrice = 0;
  
  // Initialize modal only if Bootstrap is loaded
  if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
    const orderModalElement = document.getElementById("orderModal");
    if (orderModalElement) {
      orderModal = new bootstrap.Modal(orderModalElement);
    }
  }
  
  // Product & Offer Button Event
  function openOrderModal(item, price) {
    currentItem = item;
    currentPrice = price;
  
    // Check if modal elements exist
    const orderItemName = document.getElementById("orderItemName");
    const orderQty = document.getElementById("orderQty");
    const orderTotal = document.getElementById("orderTotal");
    const orderCustomerName = document.getElementById("orderCustomerName");
    const orderPhone = document.getElementById("orderPhone");
    const orderAddress = document.getElementById("orderAddress");
    const qtyError = document.getElementById("qtyError");
    const orderForm = document.getElementById("orderForm");
    const orderSuccess = document.getElementById("orderSuccess");
  
    if (orderItemName) orderItemName.value = item;
    if (orderQty) orderQty.value = 10;
    if (orderTotal) orderTotal.textContent = "৳" + price * 10;
    if (orderCustomerName) orderCustomerName.value = "";
    if (orderPhone) orderPhone.value = "";
    if (orderAddress) orderAddress.value = "";
    if (qtyError) qtyError.classList.add("d-none");
    if (orderForm) orderForm.classList.remove("d-none");
    if (orderSuccess) orderSuccess.classList.add("d-none");
  
    // Show modal only if it's initialized
    if (orderModal) {
      orderModal.show();
    } else {
      console.warn("Order modal not initialized");
    }
  }
  
  // Attach to all Order/Shop Now buttons
  document
    .querySelectorAll(".product-card .btn, .offer-card .btn")
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const card = btn.closest(".product-card, .offer-card");
        const item = card.querySelector("h4").textContent.trim();
        let price = 0;
        // Try to get price from product card
        const priceEl = card.querySelector("p");
        if (priceEl && priceEl.textContent.match(/\d+/)) {
          price = parseInt(priceEl.textContent.replace(/[^\d]/g, ""));
        } else {
          // fallback price for offers
          price = 450;
        }
        openOrderModal(item, price);
      });
    });
  
  // Quantity +/- - Only if elements exist
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const orderForm = document.getElementById("orderForm");
  
  if (qtyMinus) {
    qtyMinus.onclick = function () {
      const orderQty = document.getElementById("orderQty");
      const orderTotal = document.getElementById("orderTotal");
      const qtyError = document.getElementById("qtyError");
  
      if (orderQty && orderTotal && qtyError) {
        let qty = parseInt(orderQty.value);
        if (qty > 10) {
          qty--;
          orderQty.value = qty;
          orderTotal.textContent = "৳" + currentPrice * qty;
          qtyError.classList.add("d-none");
        } else {
          qtyError.classList.remove("d-none");
        }
      }
    };
  }
  
  if (qtyPlus) {
    qtyPlus.onclick = function () {
      const orderQty = document.getElementById("orderQty");
      const orderTotal = document.getElementById("orderTotal");
      const qtyError = document.getElementById("qtyError");
  
      if (orderQty && orderTotal && qtyError) {
        let qty = parseInt(orderQty.value);
        qty++;
        orderQty.value = qty;
        orderTotal.textContent = "৳" + currentPrice * qty;
        qtyError.classList.add("d-none");
      }
    };
  }
  
  // Payment method change event
  $(document).on("change", "#paymentMethod", function () {
    const val = $(this).val();
    const instr = $("#paymentInstructions");
    const num = $("#paymentNumber");
    if (val === "bkash") {
      instr.removeClass("d-none");
      num.html(
        "<b>Bkash Number:</b> 017XXXXXXXX<br>Send money & enter TrxID below."
      );
      $("#trxId").attr("required", true);
    } else if (val === "nagad") {
      instr.removeClass("d-none");
      num.html(
        "<b>Nagad Number:</b> 018XXXXXXXX<br>Send money & enter TrxID below."
      );
      $("#trxId").attr("required", true);
    } else {
      instr.addClass("d-none");
      num.html("");
      $("#trxId").removeAttr("required");
    }
  });
  
  // Order Form Submit - Only if form exists
  if (orderForm) {
    orderForm.onsubmit = function (e) {
      e.preventDefault();
      const orderCustomerName = document.getElementById("orderCustomerName");
      const orderPhone = document.getElementById("orderPhone");
      const orderAddress = document.getElementById("orderAddress");
      const orderQty = document.getElementById("orderQty");
      const qtyError = document.getElementById("qtyError");
      const orderSuccess = document.getElementById("orderSuccess");
      const paymentMethod = document.getElementById("paymentMethod");
      const trxId = document.getElementById("trxId");
  
      if (!orderCustomerName || !orderPhone || !orderQty || !paymentMethod)
        return;
  
      const name = orderCustomerName.value.trim();
      const phone = orderPhone.value.trim();
      const address = orderAddress ? orderAddress.value.trim() : "";
      const qty = orderQty.value;
      const payment = paymentMethod.value;
      const trx = trxId ? trxId.value.trim() : "";
  
      if (!name || !phone.match(/^01[0-9]{9}$/) || qty < 10) {
        if (qty < 10 && qtyError) {
          qtyError.classList.remove("d-none");
        }
        return;
      }
      if ((payment === "bkash" || payment === "nagad") && !trx) {
        alert("Please enter the Transaction ID for your payment.");
        return;
      }
  
      // WhatsApp message
      let msg = `Order Request%0A------------------%0AItem: ${currentItem}%0AQuantity: ${qty}%0ATotal: ৳${
        currentPrice * qty
      }%0AName: ${name}%0APhone: ${phone}`;
      if (address) msg += `%0AAddress: ${address}`;
      if (payment === "bkash") {
        msg += `%0APayment: Bkash%0ATrxID: ${trx}`;
      } else if (payment === "nagad") {
        msg += `%0APayment: Nagad%0ATrxID: ${trx}`;
      } else {
        msg += `%0APayment: Cash on Delivery`;
      }
      window.open(`https://wa.me/88012348796542?text=${msg}`, "_blank");
  
      // Show success
      if (orderForm && orderSuccess) {
        orderForm.classList.add("d-none");
        orderSuccess.classList.remove("d-none");
      }
    };
  }
  
  // --- CART SYSTEM FOR JERSEYMAKER ---
  
  // Util: Get cart from localStorage
  function getCart() {
    let cart = localStorage.getItem("cart");
    if (!cart) return [];
    try {
      return JSON.parse(cart);
    } catch {
      return [];
    }
  }
  // Util: Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  // Util: Add item to cart
  function addToCart(item) {
    let cart = getCart();
    let found = cart.find((p) => p.id === item.id);
    if (found) {
      found.qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }
  // Util: Remove item from cart
  function removeFromCart(id) {
    let cart = getCart().filter((p) => p.id !== id);
    saveCart(cart);
  }
  // Util: Update quantity
  function updateCartQty(id, qty) {
    let cart = getCart();
    let found = cart.find((p) => p.id === id);
    if (found) {
      found.qty = qty;
      if (found.qty < 1) found.qty = 1;
    }
    saveCart(cart);
  }
  // Util: Cart total
  function cartTotal() {
    return getCart().reduce((sum, p) => sum + p.price * p.qty, 0);
  }
  
  // --- PRODUCTS PAGE: Add to Cart Button ---
  window.addEventListener("DOMContentLoaded", function () {
    // Only run on products.html
    if (window.location.pathname.includes("products.html")) {
      // Add to Cart button logic (use .product-card overlay or add new button)
      document.querySelectorAll(".product-card").forEach(function (card) {
        let btn = card.querySelector(".btn-cart-add");
        if (!btn) {
          // Create Add to Cart button if not exists
          btn = document.createElement("button");
          btn.className = "btn btn-success btn-sm btn-cart-add";
          btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
          let overlay = card.querySelector(".overlay-buttons");
          if (overlay) overlay.appendChild(btn);
        }
        btn.onclick = function (e) {
          e.preventDefault();
          let title = card.querySelector(".product-title").innerText;
          let price = parseInt(
            card.querySelector(".current-price").innerText.replace(/[^\d]/g, "")
          );
          let img = card.querySelector("img").getAttribute("src");
          let id = title.replace(/\s+/g, "_").toLowerCase();
          addToCart({ id, title, price, img, qty: 10 }); // min 10 pcs
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
          }, 1200);
        };
      });
    }
  
    // --- CART PAGE: Render Cart ---
    if (window.location.pathname.includes("cart.html")) {
      renderCart();
    }
  });
  
  function renderCart() {
    let cart = getCart();
    let cartContent = document.getElementById("cartContent");
    let emptyCart = document.getElementById("emptyCart");
    let cartItemsCount = document.getElementById("cartItemsCount");
    let cartSummary = document.getElementById("cartSummary");
    let checkoutBtn = document.getElementById("checkoutBtn");
  
    // Update cart items count
    cartItemsCount.textContent = `${cart.length} item${
      cart.length !== 1 ? "s" : ""
    }`;
  
    if (!cart.length) {
      cartContent.innerHTML = "";
      emptyCart.classList.remove("d-none");
      cartSummary.innerHTML = "";
      checkoutBtn.disabled = true;
      return;
    }
  
    emptyCart.classList.add("d-none");
    checkoutBtn.disabled = false;
  
    // Render cart items
    let cartHtml = "";
    cart.forEach((item) => {
      cartHtml += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-price">৳ ${item.price} per piece</div>
            <div class="cart-item-meta">
              <span><i class="fa-solid fa-users me-1"></i>Min: 10 pcs</span>
              <span><i class="fa-solid fa-clock me-1"></i>3-5 days delivery</span>
            </div>
          </div>
          <div class="cart-item-quantity">
            <div class="quantity-controls">
              <button class="quantity-btn btn-qty-minus" data-id="${item.id}" ${
        item.qty <= 10 ? "disabled" : ""
      }>
                <i class="fa-solid fa-minus"></i>
              </button>
              <input type="number" class="quantity-input cart-qty-input" value="${
                item.qty
              }" min="10" data-id="${item.id}">
              <button class="quantity-btn btn-qty-plus" data-id="${item.id}">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">৳ ${item.price * item.qty}</div>
          <button class="cart-item-remove btn-cart-remove" data-id="${item.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    });
  
    cartContent.innerHTML = cartHtml;
  
    // Render cart summary
    let summaryHtml = `
      <div class="summary-row">
        <span class="summary-label">Subtotal (${cart.length} item${
      cart.length !== 1 ? "s" : ""
    })</span>
        <span class="summary-value">৳ ${cartTotal()}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Shipping</span>
        <span class="summary-value">Free</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Total</span>
        <span class="summary-value summary-total">৳ ${cartTotal()}</span>
      </div>
    `;
  
    cartSummary.innerHTML = summaryHtml;
  
    // Add event listeners
    document.querySelectorAll(".btn-qty-minus").forEach((btn) => {
      btn.onclick = function () {
        let id = btn.getAttribute("data-id");
        let input = document.querySelector(`.cart-qty-input[data-id='${id}']`);
        let qty = parseInt(input.value) - 1;
        if (qty < 10) qty = 10;
        updateCartQty(id, qty);
        renderCart();
      };
    });
  
    document.querySelectorAll(".btn-qty-plus").forEach((btn) => {
      btn.onclick = function () {
        let id = btn.getAttribute("data-id");
        let input = document.querySelector(`.cart-qty-input[data-id='${id}']`);
        let qty = parseInt(input.value) + 1;
        updateCartQty(id, qty);
        renderCart();
      };
    });
  
    document.querySelectorAll(".cart-qty-input").forEach((input) => {
      input.onchange = function () {
        let id = input.getAttribute("data-id");
        let qty = parseInt(input.value);
        if (isNaN(qty) || qty < 10) qty = 10;
        updateCartQty(id, qty);
        renderCart();
      };
    });
  
    document.querySelectorAll(".btn-cart-remove").forEach((btn) => {
      btn.onclick = function () {
        let id = btn.getAttribute("data-id");
        removeFromCart(id);
        renderCart();
      };
    });
  
    // Checkout button event
    checkoutBtn.onclick = function () {
      window.location.href = "order.html";
    };
  }
  
  // --- DEMO: If cart is empty, add demo item for preview (remove in production) ---
  if (window.location.pathname.includes("cart.html") && getCart().length === 0) {
    addToCart({
      id: "demo_jersey",
      title: "Demo Jersey",
      price: 500,
      img: "images/PhotoRoom-20250706_141831.png",
      qty: 10,
    });
  }
  