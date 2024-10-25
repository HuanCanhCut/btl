const event = {
    cartLength(cart) {
        return cart.length
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

    addToCart(productId, products, cart) {
        const product = products.find((item) => item.id === Number(productId))

        // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const isInCart = cart.some((item) => item.id === Number(productId))

        // nếu sản phẩm không có trong giỏ hàng thì thêm vào
        if (isInCart) {
            this.showToast('Sản phẩm đã có trong giỏ hàng', 'error')
            model.classList.remove('active')
            return
        }

        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart))
        this.updateCartLength()
        this.showToast('Thêm vào giỏ hàng thành công')

        model.classList.remove('active')
    },

    closeModel() {
        const model = document.querySelector('.model')
        model.classList.remove('active')

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
}

export default event
