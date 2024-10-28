const model = document.querySelector('.model')
const modelContainer = document.querySelector('.model-container')

const event = {
    cartLength(cart) {
        return cart.length
    },

    updateCartLength(cart) {
        const cartLength = this.cartLength(cart)

        const navCartLength = document.querySelector('.nav-cart-length')
        if (navCartLength) {
            navCartLength.textContent = cartLength
        }
    },

    // Show toast của thư viện bên ngoài
    showToast(message, type = 'success') {
        const successStyle = 'linear-gradient(to right, #00b09b, #96c93d)'
        const errorStyle = 'linear-gradient(to right, #ff0000, #ff9999)'
        const warningStyle = 'linear-gradient(to right, #ffa500, #ffd700)'

        Toastify({
            text: message,
            duration: 1500,
            newWindow: true,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: type === 'success' ? successStyle : type === 'error' ? errorStyle : warningStyle,
            },
            onClick: function () {}, // Callback after click
        }).showToast()
    },

    openModel(e, products) {
        if (e.target.closest('.product-item')) {
            const productId = e.target.closest('.product-item').dataset.id
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
    },

    addToCart(productId, products, cart) {
        // get product id

        const product = products.find((item) => item.id === Number(productId))

        // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const isInCart = cart.some((item) => item.id === Number(productId))

        // nếu sản phẩm không có trong giỏ hàng thì thêm vào
        if (isInCart) {
            this.showToast('Sản phẩm đã có trong giỏ hàng', 'error')
            model.classList.remove('active')
            return
        }

        cart.push({ ...product, quantity: 1 })
        localStorage.setItem('cart', JSON.stringify(cart))
        this.updateCartLength(cart)
        this.showToast('Thêm vào giỏ hàng thành công')

        model.classList.remove('active')
    },
}

export default event
