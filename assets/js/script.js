let cart = [];
let modalQt = 1;
let modalKey = 0;

const getElement = (e) => document.querySelector(e);
const getAll = (e) => document.querySelectorAll(e);

// listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = getElement('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[0].toFixed(2)}`;
    
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        getElement('.pizzaBig img').src = pizzaJson[key].img;
        getElement('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        getElement('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        getElement('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[0].toFixed(2)}`;

        getElement('.pizzaInfo--size.selected').classList.remove('selected');

        getAll('.pizzaInfo--size').forEach((size, index) => {
            if (index === 0) size.classList.add('selected');
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
        });

        getElement('.pizzaInfo--qt').innerHTML = modalQt;

        getElement('.pizzaWindowArea').style.opacity = 0;
        getElement('.pizzaWindowArea').style.display = 'flex';
        
        setTimeout(() => {
            getElement('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    getElement('.pizza-area').append(pizzaItem);
});

// eventos do modal
const closeModal = () => {
    getElement('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        getElement('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

getAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

getElement('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        getElement('.pizzaInfo--qt').innerHTML = --modalQt;
    }
});

getElement('.pizzaInfo--qtmais').addEventListener('click', () => {
    getElement('.pizzaInfo--qt').innerHTML = ++modalQt;
});

getAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        getElement('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let indexPrice = parseInt(size.getAttribute('data-key'));
        getElement('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[indexPrice].toFixed(2)}`;
    });
});

getElement('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(getElement('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier === identifier);

    if (key != -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    
    updateCart();
    closeModal();
});

getElement('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        getElement('aside').style.left = '0';
    }
});

getElement('.menu-closer').addEventListener('click', () => {
    getElement('aside').style.left = '100vw';
});

const updateCart = () => {
    getElement('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        getElement('aside').classList.add('show');
        getElement('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);            
            let cartItem = getElement('.models .cart--item').cloneNode(true);
            let pizzaName = `${pizzaItem.name} (${pizzaItem.sizes[cart[i].size]})`;

            subtotal += pizzaItem.price[cart[i].size] * cart[i].qt;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) cart[i].qt--;
                else cart.splice(i, 1);
                updateCart();
            });
            
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            getElement('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        getElement('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        getElement('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        getElement('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        getElement('aside').classList.remove('show');
        getElement('aside').style.left = '100vw';
    }
}
