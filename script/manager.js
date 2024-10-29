import products from './product.js'
import event from './event.js'

const productList = document.querySelector('#product-list')
const model = document.querySelector('.model')
const modelOverlay = document.querySelector('.model-overlay')
const closeModelBtn = document.querySelector('.model-content-close-btn')
const productImage = document.querySelector('.model-content-img')
const productImageInput = document.querySelector('#model-content-img')
const modelContentFormName = document.querySelector('#model-content-form-name')
const modelContentFormPrice = document.querySelector('#model-content-form-price')
const modelContentFormError = document.querySelector('.model-content-form-error')
// Do querySelectorAll trả về NodeList nên phải dùng spread operator chuyển thành mảng để sử dụng higher order function (forEach, map, ...)
const modelContentFormTab = [...document.querySelectorAll('.model-content-form-tabs-btn')]

const submitBtn = document.querySelector('.model-content-form-submit-btn')

const app = {
    products: JSON.parse(localStorage.getItem('product')) || products,
    cart: JSON.parse(localStorage.getItem('cart')) || [],

    groupByCategory() {
        return this.products.reduce((acc, item) => {
            acc[item.category] = [...(acc[item.category] || []), item]
            return acc
        }, {})
    },

    renderProduct() {
        const categories = this.groupByCategory()

        const html = Object.keys(categories).map((category) => {
            return `
                <div class="product-container">
                    <h2 class="product-title" data-category="${category}">${category}</h2>
                    <ul class="product-list">
                        ${categories[category]
                            .map((item) => {
                                return `
                                <li class="product-item" data-id="${item.id}">
                                    <button class="product-item-delete-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
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

    handleOpenModel() {
        model.classList.add('active')
    },

    handleCloseModel() {
        model.classList.remove('active')
    },

    handleLoadCategory() {
        const categorySelect = document.querySelector('.model-content-form-category')
        categorySelect.innerHTML = Object.keys(this.groupByCategory())
            .map((category) => {
                return `<option value="${category}">${category}</option>`
            })
            .join('')
    },

    handleEditProduct(id) {
        this.handleOpenModel()
        const product = this.products.find((item) => item.id === id)
        // Set image for product
        productImage.setAttribute('src', product.image)

        // Set name for product
        modelContentFormName.value = product.name

        // Set price for product
        modelContentFormPrice.value = product.price

        // Xử lí submit form
        submitBtn.onclick = () => {
            const newName = modelContentFormName.value
            const newPrice = modelContentFormPrice.value
            let category = document.querySelector('.model-content-category.active')

            if (category.dataset.tab === 'create') {
                category = category.querySelector('#model-content-new-category-name').value
            } else {
                category = category.value
            }

            if (!newName || !newPrice) {
                modelContentFormError.textContent = 'Vui lòng nhập đẩy đủ thông tin'
                return
            }

            this.products.map((item) => {
                if (item.id === id) {
                    item.name = newName
                    item.price = newPrice
                    item.category = category
                }
            })

            this.handleCloseModel()
            this.renderProduct()
            localStorage.setItem('product', JSON.stringify(this.products))
        }
    },

    handleChangeImage() {
        productImageInput.onchange = () => {
            const oldSrc = productImage.getAttribute('src')

            // Xóa bỏ ảnh cũ tránh rò rỉ bộ nhớ
            if (oldSrc.startsWith('blob:')) {
                URL.revokeObjectURL(oldSrc)
            }

            const file = productImageInput.files[0]
            productImage.setAttribute('src', URL.createObjectURL(file))
        }
    },

    handleDeleteProduct(id) {
        const deleteModel = document.querySelector('.delete-model')
        const deleteModelOverlay = document.querySelector('.delete-model-overlay')
        const deleteModelConfirmBtn = document.querySelector('.delete-model-confirm-btn')
        const deleteModelCancelBtn = document.querySelector('.delete-model-cancel-btn')

        deleteModel.classList.add('active')

        deleteModelOverlay.onclick = () => {
            deleteModel.classList.remove('active')
        }

        deleteModelCancelBtn.onclick = () => {
            deleteModel.classList.remove('active')
        }

        deleteModelConfirmBtn.onclick = () => {
            // Xóa sản phẩm trong products và cart
            this.products = this.products.filter((item) => item.id !== id)
            this.cart = this.cart.filter((item) => item.id !== id)

            // Render lại product và cart
            this.renderProduct()
            localStorage.setItem('product', JSON.stringify(this.products))
            localStorage.setItem('cart', JSON.stringify(this.cart))

            // Đóng modal và hiển thị toast
            deleteModel.classList.remove('active')
            event.showToast('Xóa sản phẩm thành công', 'success')
        }
    },

    handleEvent() {
        productList.onclick = (e) => {
            const target = e.target
            if (target.closest('.product-item-delete-btn')) {
                const id = target.closest('.product-item').dataset.id
                this.handleDeleteProduct(Number(id))
                return
            }

            if (target.closest('.product-item')) {
                const id = target.closest('.product-item').dataset.id
                this.handleEditProduct(Number(id))
            }
        }

        modelOverlay.onclick = () => {
            this.handleCloseModel()
        }

        closeModelBtn.onclick = () => {
            this.handleCloseModel()
        }

        // Set category for product
        this.handleLoadCategory()
        this.handleChangeImage()

        // Xử lí tab chọn category
        modelContentFormTab.forEach((tab) => {
            tab.onclick = () => {
                // Lấy tab đang active
                const categoryOptions = [...document.querySelectorAll('.model-content-category')]
                const currentTab = modelContentFormTab.find((tab) => tab.classList.contains('active'))

                // đổi tab
                if (tab.dataset.tab !== currentTab.dataset.tab) {
                    currentTab.classList.remove('active')
                    tab.classList.add('active')

                    // Đổi category
                    categoryOptions.forEach((option) => {
                        if (option.dataset.tab === tab.dataset.tab) {
                            option.classList.add('active')
                        } else {
                            option.classList.remove('active')
                        }
                    })
                }
            }
        })

        // Xóa lỗi khi nhập input
        modelContentFormName.oninput = () => {
            modelContentFormError.textContent = ''
        }

        modelContentFormPrice.oninput = () => {
            modelContentFormError.textContent = ''
        }
    },

    pageHandle() {
        const tabs = document.querySelectorAll('.app-header-btn')
        tabs.forEach((tab) => {
            tab.onclick = (e) => {
                // Thay đổi tab active
                const tabActive = document.querySelector('.app-header-btn.active')
                if (tabActive) {
                    tabActive.classList.remove('active')
                }
                e.target.classList.add('active')

                // Thay đổi main theo tab
                const pageId = e.target.id
                const mainActive = document.querySelector('.main.active')
                if (mainActive) {
                    mainActive.classList.remove('active')
                }
                document.querySelector(`.main.${pageId}`).classList.add('active')
            }
        })
    },

    handleAddProduct() {
        const formData = {}

        const addProductFormSubmitBtn = document.querySelector('.add-product-form-submit-btn')
        const addProductFormError = document.querySelector('.add-product-form-error')
        const form = document.querySelector('.add-product-form')

        addProductFormSubmitBtn.onclick = () => {
            const formInputs = [...form.querySelectorAll('input')]

            formInputs.forEach((input) => {
                // Xóa lỗi khi nhập input
                input.oninput = () => {
                    addProductFormError.textContent = ''
                }
            })

            // Lấy dữ liệu từ form
            formInputs.forEach((input) => {
                formData[input.name] = input.value
            })

            // Kiểm tra dữ liệu
            for (const key in formData) {
                if (!formData[key]) {
                    addProductFormError.textContent = 'Vui lòng nhập đẩy đủ thông tin'
                    return
                }
            }

            const seasonal = form.querySelector('#add-product-form-seasonal').value

            formData.seasonal = seasonal

            // Thêm sản phẩm
            this.products.push({
                id: Number(this.products[this.products.length - 1].id + 1),
                ...formData,
                star: 0,
                sold: 0,
                price: Number(formData.price),
            })

            // Render lại product
            this.renderProduct()
            event.showToast('Thêm sản phẩm thành công', 'success')
            localStorage.setItem('product', JSON.stringify(this.products))
        }
    },

    windowEvent() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    this.handleCloseModel()
                    break
            }
        })
    },

    start() {
        this.renderProduct()
        this.handleEvent()
        this.windowEvent()
        this.pageHandle()

        // Add product
        this.handleAddProduct()
    },
}

app.start()
