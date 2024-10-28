import event from './event.js'

const productList = document.querySelector('.product-list')

const model = document.querySelector('.model')
const modelOverlay = document.querySelector('.model-overlay')
const modelContentBtnCancel = document.querySelector('.model-content-btn-cancel')
const modelContentBtnConfirm = document.querySelector('.model-content-btn-confirm')

const cartFooterSelectAllCheckbox = document.querySelector('.cart-footer-select-all-checkbox')
const totalProductSelected = document.querySelector('.total-product-selected')
const cartFooterTotalPrice = document.querySelector('.cart-footer-total-price')

const app = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    productSelected: [],

    renderProduct() {
        const html = this.cart.map((item) => {
            return `
                <li class="product-item">
                    <div class="product-item-info">
                        <input type="checkbox" class="product-item-checkbox" data-id="${item.id}" ${
                this.productSelected.includes(item.id) ? 'checked' : ''
            } />

                        <div class="product-item-info-content">
                            <img
                                src="${item.image}"
                                alt=""
                            />
                            <div class="product-info">
                                <h4 class="product-info-name">${item.name}</h4>
                                <p class="product-info-price">${item.price.toLocaleString()} VNĐ</p>
                                <p class="product-star"><i class="fa-solid fa-star"></i><span>${item.star}</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="product-interaction">
                        <div class="product-interaction-quantity">
                            <button class="product-interaction-quantity-btn" data-action="decrease" data-id="${
                                item.id
                            }">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <input class="product-interaction-quantity-value" value="${item.quantity}" />
                            <button class="product-interaction-quantity-btn" data-action="increase" data-id="${
                                item.id
                            }">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <button class="product-interaction-trash-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </li>
            `
        })

        productList.innerHTML = html.join('')
    },

    closeModel() {
        model.classList.remove('active')
    },

    handleTrashProduct(productId) {
        model.classList.add('active')

        modelContentBtnConfirm.onclick = () => {
            const newCart = this.cart.filter((item) => Number(item.id) !== Number(productId))
            localStorage.setItem('cart', JSON.stringify(newCart))
            this.cart = newCart
            this.renderProduct()
            event.showToast('Xóa sản phẩm thành công', 'success')
            this.closeModel()
        }

        modelContentBtnCancel.onclick = () => {
            this.closeModel()
        }

        modelOverlay.onclick = () => {
            this.closeModel()
        }
    },

    loadTotalPrice() {
        // Lấy sản phẩm được chọn
        const productSelected = this.cart.filter((item) => this.productSelected.includes(item.id))
        // Tính tổng tiền của sản phẩm
        const totalPrice = productSelected.reduce((total, item) => total + item.price * item.quantity, 0)
        // Hiển thị tổng tiền
        cartFooterTotalPrice.textContent = `${totalPrice.toLocaleString()} VNĐ`
        totalProductSelected.textContent = `${productSelected.length} sản phẩm`
    },

    handleQuantity(productId, action) {
        const currentQuantity = this.cart.find((item) => Number(item.id) === Number(productId)).quantity || 1

        switch (action) {
            case 'decrease':
                if (currentQuantity > 1) {
                    this.cart.find((item) => Number(item.id) === Number(productId)).quantity = currentQuantity - 1
                }
                break
            case 'increase':
                this.cart.find((item) => Number(item.id) === Number(productId)).quantity = currentQuantity + 1
                break
        }

        this.renderProduct()
        this.loadTotalPrice()
    },

    handleCheckbox(productId) {
        if (this.productSelected.includes(productId)) {
            this.productSelected = this.productSelected.filter((item) => Number(item) !== Number(productId))
            this.loadTotalPrice()
        } else {
            this.productSelected.push(productId)
            this.loadTotalPrice()
        }
    },

    handleSelectAll() {
        const isChecked = cartFooterSelectAllCheckbox.checked
        if (isChecked) {
            this.productSelected = this.cart.map((item) => item.id)
        } else {
            this.productSelected = []
        }
        this.loadTotalPrice()
        this.renderProduct()
    },

    handleEvent() {
        productList.onclick = (e) => {
            // Trash product
            if (e.target.closest('.product-interaction-trash-btn')) {
                const productId = e.target.closest('.product-interaction-trash-btn').dataset.id
                this.handleTrashProduct(productId)
            }

            // Quantity
            if (e.target.closest('.product-interaction-quantity-btn')) {
                const productId = e.target.closest('.product-interaction-quantity-btn').dataset.id
                const action = e.target.closest('.product-interaction-quantity-btn').dataset.action
                this.handleQuantity(productId, action)
            }

            // Checkbox
            if (e.target.closest('.product-item-checkbox')) {
                const productId = e.target.closest('.product-item-checkbox').dataset.id
                this.handleCheckbox(Number(productId))
            }
        }

        // Select all
        cartFooterSelectAllCheckbox.onclick = () => {
            this.handleSelectAll()
        }
    },

    windowEvent() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    if (model.classList.contains('active')) {
                        this.closeModel()
                    }
                    break
            }
        })
    },

    start() {
        event.updateCartLength(this.cart)
        this.renderProduct()
        this.loadTotalPrice()
        this.handleEvent()
        this.windowEvent()
    },
}

app.start()
