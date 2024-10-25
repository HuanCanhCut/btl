import products from './product.js'

const input = document.getElementById('search-input')
const searchBtn = document.querySelector('.search-container button')
const productList = document.querySelector('.product-list')
const model = document.querySelector('.model')
const modelContainer = document.querySelector('.model-container')

const app = {
    handleSearch() {
        const value = input.value.trim()
        if (!value) return

        const result = products.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
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
        searchBtn.addEventListener('click', this.handleSearch)

        productList.onclick = (e) => {
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
        }
    },

    windowEvent() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleSearch()
        })
    },

    start() {
        this.handleEvent()
        this.windowEvent()
    },
}

app.start()
