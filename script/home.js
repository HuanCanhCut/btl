import product from './product.js'

const sidebarList = document.querySelector('.sidebar-list')
const content = document.querySelector('#content')
const model = document.querySelector('.model')
const modelContainer = document.querySelector('.model-container')
const overlay = document.querySelector('.overlay')

const app = {
    cart: [],
    // Phân loại sản phẩm theo category
    groupByCategory() {
        return product.reduce((acc, item) => {
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

    handleEvent() {
        // Open model when click product
        content.onclick = (e) => {
            if (e.target.closest('.content-item')) {
                const productId = e.target.closest('.content-item').dataset.id
                model.classList.add('active')

                const productInfo = product.find((item) => item.id === Number(productId))

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

                        <button class="model-add-cart">Thêm vào giỏ hàng</button>
                    </main>
                `
            }
        }

        // Close model when click overlay
        overlay.onclick = () => {
            model.classList.remove('active')
        }

        // Close model when click close button
        model.onclick = (e) => {
            if (e.target.closest('.model-close')) {
                model.classList.remove('active')
            }
        }
    },

    start() {
        localStorage.setItem('product', JSON.stringify(this.groupByCategory()))
        this.handleEvent()
        this.renderSidebar()
        this.renderProduct()
    },
}

app.start()
