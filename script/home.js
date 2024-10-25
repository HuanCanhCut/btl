import products from './product.js'

const sidebarList = document.querySelector('.sidebar-list')
const content = document.querySelector('#content')
const model = document.querySelector('.model')
const modelContainer = document.querySelector('.model-container')
const overlay = document.querySelector('.overlay')

const app = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],

    cartLength() {
        return this.cart.length
    },

    showToast(message) {
        toastr.success(message, 'Thông báo')
    },

    updateCartLength() {
        const cartLength = this.cartLength()
        document.querySelector('.nav-cart-length').textContent = cartLength
    },

    // Show toast của thư viện bên ngoài
    showToast(message, type = 'success') {
        const successStyle = 'linear-gradient(to right, #00b09b, #96c93d)'
        const errorStyle = 'linear-gradient(to right, #ff0000, #ff9999)'
        const warningStyle = 'linear-gradient(to right, #ffa500, #ffd700)'

        Toastify({
            text: message,
            duration: 3000,
            destination: 'https://github.com/apvarun/toastify-js',
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: type === 'success' ? successStyle : type === 'error' ? errorStyle : warningStyle,
            },
            onClick: function () {}, // Callback after click
        }).showToast()
    },

    // Phân loại sản phẩm theo category
    groupByCategory() {
        return products.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || []
            acc[item.category].push(item)
            return acc
        }, {})
    },

    // Render product
    renderSidebar() {
        const categories = JSON.parse(localStorage.getItem('product')) || this.groupByCategory()

        const html = Object.keys(categories).map((item) => {
            return `<li class="sidebar-item">${item}</li>`
        })
        sidebarList.innerHTML = html.join('')
    },

    renderProduct() {
        const categories = JSON.parse(localStorage.getItem('product')) || this.groupByCategory()

        const html = Object.keys(categories).map((category) => {
            return `
                <div class="content-container">
                    <h2 class="content-title">${category}</h2>
                    <ul class="content-list">
                        ${categories[category]
                            .map((item) => {
                                return `
                                <li class="content-item" data-id="${item.id}">
                                    <img src="${item.image}" alt="${item.name}" />
                                    <div class="content-item-info">
                                        <h3 class="content-item-name">${item.name}</h3>
                                        <p class="content-item-price">${item.price.toLocaleString()} VND</p>
                                        <p class="product-reaction"><span><i class="fa-solid fa-star"></i> ${
                                            item.star
                                        }</span> Đã bán: ${item.sold}</p>
                                    </div>
                                </li>
                            `
                            })
                            .join('')}
                    </ul>
                </div>
            `
        })

        content.innerHTML = html.join('')
    },

    addToCart(productId) {
        const product = products.find((item) => item.id === Number(productId))

        // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const isInCart = this.cart.some((item) => item.id === Number(productId))

        // nếu sản phẩm không có trong giỏ hàng thì thêm vào
        if (isInCart) {
            this.showToast('Sản phẩm đã có trong giỏ hàng', 'error')
            model.classList.remove('active')
            return
        }

        this.cart.push(product)
        localStorage.setItem('cart', JSON.stringify(this.cart))
        this.updateCartLength()
        this.showToast('Thêm vào giỏ hàng thành công')

        model.classList.remove('active')
    },

    handleEvent() {
        // Open model when click product
        content.onclick = (e) => {
            if (e.target.closest('.content-item')) {
                const productId = e.target.closest('.content-item').dataset.id
                model.classList.add('active')

                const productInfo = products.find((item) => item.id === Number(productId))

                modelContainer.innerHTML = `
                    <header class="model-header">
                        <h2>Thông tin sản phẩm</h2>
                        <button class="model-close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </header>
                    <main class="model-main">
                        <img
                            src="${productInfo.image}"
                            alt="image"
                        />
                        <div class="model-info">
                            <h4>${productInfo.name}</h4>
                            <p class="model-info-price">${productInfo.price.toLocaleString()} VND</p>
                            <p class="product-reaction"><span><i class="fa-solid fa-star"></i> ${
                                productInfo.star
                            }</span> Đã bán: ${productInfo.sold}</p>
                        </div>
                        
                        <button class="model-add-cart" data-id="${productInfo.id}">Thêm vào giỏ hàng</button>
                    </main>
                `
            }
        }

        // Close model when click overlay
        overlay.onclick = () => {
            model.classList.remove('active')
        }

        model.onclick = (e) => {
            // Close model when click close button
            if (e.target.closest('.model-close')) {
                model.classList.remove('active')
            }

            if (e.target.closest('.model-add-cart')) {
                // get product id
                const productId = e.target.closest('.model-add-cart').dataset.id
                this.addToCart(productId)
            }
        }
    },

    windowEvent() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                // Close model when press escape
                case 'Escape':
                    model.classList.remove('active')
                    break
            }
        })
    },

    start() {
        localStorage.setItem('product', JSON.stringify(this.groupByCategory()))
        this.updateCartLength()
        this.renderSidebar()
        this.renderProduct()

        this.handleEvent()
        this.windowEvent()
    },
}

app.start()
