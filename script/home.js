import products from './product.js'
import event from './event.js'

const sidebarList = document.querySelector('.sidebar-list')
const productList = document.querySelector('#product-list')
const model = document.querySelector('.model')
const overlay = document.querySelector('.overlay')
const tabs = document.querySelector('.tabs')

const app = {
    isSeasonal: false,
    sidebarItemActiveIndex: 0,
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: JSON.parse(localStorage.getItem('product')) || products || [],

    // Load tab active
    loadTabActive() {
        const seasonalTab = tabs.querySelector('[data-tab="seasonal"]')
        const categoryTab = tabs.querySelector('[data-tab="category"]')

        seasonalTab.classList.toggle('active', this.isSeasonal)
        categoryTab.classList.toggle('active', !this.isSeasonal)
    },

    // Phân loại sản phẩm theo category
    groupByCategory() {
        return this.products.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || []
            acc[item.category].push(item)
            return acc
        }, {})
    },

    groupBySeasonal() {
        return this.products.reduce((acc, item) => {
            acc[item.seasonal] = acc[item.seasonal] || []
            acc[item.seasonal].push(item)
            return acc
        }, {})
    },

    // Render product
    renderSidebar() {
        const categories = this.isSeasonal ? this.groupBySeasonal() : this.groupByCategory()

        const html = Object.keys(categories).map((item, index) => {
            return `<li class="sidebar-item ${
                index === this.sidebarItemActiveIndex ? 'active' : ''
            }" data-categorySidebar="${item}" data-index="${index}">${item}</li>`
        })
        sidebarList.innerHTML = html.join('')
    },

    scrollToCategory(category) {
        // Lấy element có attribute data-category bằng category
        const categoryElement = document.querySelector(`h2[data-category="${category}"]`)

        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },

    renderProduct() {
        const categories = this.isSeasonal ? this.groupBySeasonal() : this.groupByCategory()

        const html = Object.keys(categories).map((category) => {
            return `
                <div class="product-container">
                    <h2 class="product-title" data-category="${category}">${category}</h2>
                    <ul class="product-list">
                        ${categories[category]
                            .map((item) => {
                                return `
                                <li class="product-item" data-id="${item.id}">
                                    <img src="${item.image}" alt="${item.name}" />
                                    <div class="product-item-info">
                                        <h3 class="product-item-name">${item.name}</h3>
                                        <p class="product-item-price">${item.price.toLocaleString()} VND</p>
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

        productList.innerHTML = html.join('')
    },

    handleEvent() {
        // Open model when click product
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

        // Scroll đến category khi click category trong sidebar
        sidebarList.onclick = (e) => {
            if (e.target.closest('.sidebar-item')) {
                // Lấy category từ attribute data-categorySidebar
                const category = e.target.closest('.sidebar-item').getAttribute('data-categorySidebar')
                this.sidebarItemActiveIndex = Number(e.target.closest('.sidebar-item').dataset.index)
                this.scrollToCategory(category)

                this.renderSidebar()
            }
        }

        tabs.onclick = (e) => {
            if (e.target.closest('.tab-item')) {
                const tab = e.target.closest('.tab-item').dataset.tab

                this.isSeasonal = tab === 'seasonal'
                this.loadTabActive()
                this.renderSidebar()
                this.renderProduct()
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
        const localProduct = JSON.parse(localStorage.getItem('product'))

        if (!localProduct) {
            localStorage.setItem('product', JSON.stringify(products))
        }

        event.updateCartLength(this.cart)
        this.renderSidebar()
        this.renderProduct()

        this.handleEvent()
        this.windowEvent()
    },
}

app.start()
