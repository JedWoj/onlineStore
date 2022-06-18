import { getAllProducts } from "./utils/getDataFromApi";

export class offersHandler {
    constructor() {
        this.products;
        this.active;
        this.page = -1;        
        this.getProducts();
        this.prepareCategories();
        this.handleSorting();
    }

    async getProducts() {
        this.products = await getAllProducts();
        this.active = [...this.products];
        this.renderProducts(this.products);
        this.seeMoreHandler();
    }

    handleSorting() {
        const options = document.querySelectorAll('.dropdown-item')
        options.forEach(option => option.addEventListener('click', (e) => {
            const {target} = e;
            const clicked = target.closest('.dropdown-item').textContent;
            this.checkOption(clicked)
        }))
    }

    checkOption(option) {
        const container = document.querySelector('.offers');
        container.innerHTML = '';
        this.page = -1;
        option === 'ascending' ? this.sortAscending() : this.sortDescending();
    }

    sortAscending() {
        const sorted = this.active.sort((a, b) => a.price - b.price);
        this.active = [...sorted];
        this.renderProducts(this.active);
    }

    sortDescending() {
        const sorted = this.active.sort((a, b) => b.price - a.price);
        this.active = [...sorted];
        this.renderProducts(this.active);
    }

    prepareCategories() {
        const categories = document.querySelectorAll('.list-group-item-action');
        categories.forEach(cat => cat.addEventListener('click', (e) => {
            const {target} = e;
            const category = target.closest('.list-group-item-action').textContent.trim();
            this.getCategory(category);
            this.handleCategoriesColors(target,categories);
        }))
    }

    getCategory(category) {
        const newArr = this.products.filter(obj => obj.category === category);
        newArr.length > 0 ? this.active = [...newArr] : this.active = [...this.products];
        this.handleCategories();
    }

    handleCategoriesColors(target,allBtns) {
        const btns = [...allBtns]
        btns.forEach(btn => btn.classList.remove('active'))
        target.classList.add('active');
    }

    handleCategories() {
        this.page = -1;
        const container = document.querySelector('.offers');
        container.innerHTML = '';
        this.renderProducts(this.active);
    }

    renderProducts(arr) {
        const btn = document.querySelector('.btn-load');
        btn.classList.remove('disabled');
        arr = [...this.active];
        this.page++;
        const container = document.querySelector('.offers');
        for (let i = 8 * this.page; i < 8 + 8 * this.page; i++) {
                if(!arr[i]) {
                    btn.classList.add('disabled');
                    return
                }
                const div = `
                    <div class="col col-12 col-sm-6 col-md-4 col-lg-3 mt-5">
                        <div class="card">
                            <img class="card-img-top" src="${arr[i].image}" alt="${arr[i].title}">
                            <div class="card-body d-flex justify-content-end flex-column">
                                <div class="card-wrap">
                                <h5 class="card-title">
                                    ${arr[i].title}
                                </h5>
                                <p class="card-price">
                                    ${arr[i].price}$
                                </p>
                                </div>
                                <a href="offers/${arr[i].id}.html" class="btn card__btn btn-primary">More Details</a>
                            </div>
                        </div>
                    </div>
                    `;
                    
                container.insertAdjacentHTML("beforeend", div);
            }
        }

        seeMoreHandler() {
            const btn = document.querySelector('.btn-load');
            btn.addEventListener('click', this.renderProducts.bind(this,this.active));
            console.log(this.products);
        }
    }