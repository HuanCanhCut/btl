import products from './product.js'
import event from './event.js'

const input = document.getElementById('search-input')
const searchBtn = document.querySelector('.search-container button')
const productList = document.querySelector('.product-list')
const overlay = document.querySelector('.overlay')
const model = document.querySelector('.model')

const app = {
    products: JSON.parse(localStorage.getItem('product')) || products,
    cart: JSON.parse(localStorage.getItem('cart')) || [],

    handleSearch() {
        const value = input.value.trim()
        if (!value) return

        const result = this.products.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
        this.renderProductList(result)
    },

    renderProductList(products) {
        if (products.length === 0) {
            productList.innerHTML = '<p class="product-not-found">Không tìm thấy sản phẩm nào</p>'
            return
        }

        productList.innerHTML = products
            .map(
                (item) => `
                <li class="product-item" data-id="${item.id}">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        />
                        <div class="product-item-info">
                            <h3 class="product-item-name">${item.name}</h3>
                            <div>
                                <p class="product-item-price">${item.price.toLocaleString()} VND</p>
                                <p class="product-reaction">
                                    <span><i class="fa-solid fa-star"></i> ${item.star}</span> Đã bán: ${item.sold}
                                </p>
                            </div>
                        </div>
                    </li>`
            )
            .join('')
    },

    handleEvent() {
        searchBtn.onclick = () => {
            this.handleSearch()
        }

        productList.onclick = (e) => {
            event.openModel(e, this.products)
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
                const productId = e.target.closest('.model-add-cart').dataset.id
                event.addToCart(productId, this.products, this.cart)
            }
        }
    },

    windowEvent() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    this.handleSearch()
                    break
                case 'Escape':
                    model.classList.remove('active')
                    break
            }
        })
    },

    start() {
        input.focus()
        this.handleEvent()
        this.windowEvent()
    },
}

app.start()
