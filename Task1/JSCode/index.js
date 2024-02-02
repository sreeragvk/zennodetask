const readlineSync = require('readline-sync'); // npm install readline-sync

let products = {"Product A": 20, "Product B": 40, "Product C": 50}; //product dictionary

class Cart {
    constructor() {                      //initialising attributes
        this.cartItems = {};
        this.totalCost = 0;
        this.totalQuantity = 0;
        this.discount = {};
        this.selectedDiscount = {};
        this.giftItemsCart = {};
        this.wrappingFee = 0;
    }

    addToCart(productName, quantity, giftWrapping) {   //addtocart method
        if (productName in this.cartItems) {           //append to cart if item alreay exist else create new record for product
            this.cartItems[productName] += quantity;
        } else {
            this.cartItems[productName] = quantity;
        }

        if (giftWrapping !== null) {                   //adding to cart gift items if wrapping is selected
            if (giftWrapping) {
                if (productName in this.giftItemsCart) {
                    this.giftItemsCart[productName] += quantity;
                } else {
                    this.giftItemsCart[productName] = quantity;
                }
            }
        }
    }

    displayCart() {                                    //cart display
        console.log("Cart Items:\n");

        for (let [product, quantity] of Object.entries(this.cartItems)) {
            console.log(`Product: ${product}, unitPrice: ${products[product]}, Quantity: ${quantity}, Gifted Quantity: ${this.giftItemsCart[product] || 0}`);
        }

        console.log(`\nTotal Amount: ${this.totalCost}\n`);
        let [discountName, discountAmount] = Object.entries(this.selectedDiscount)[0];
        console.log(`Applied Discount: ${discountName}, Discount Amount: ${discountAmount}\n`);
        console.log(`Shipping Charge: ${Math.ceil(this.totalQuantity / 10) * 5}\n`);
        console.log(`Wrapping Fee: ${this.wrappingFee}\n`);
        console.log(`Payable Amount: ${(this.totalCost - discountAmount) + (Math.ceil(this.totalQuantity / 10) * 5) + this.wrappingFee}`);
    }

    calculateDiscount() {                                           //discount calculation
        for (let [key, value] of Object.entries(this.cartItems)) {
            this.totalQuantity += value;
            this.totalCost += products[key] * value;                //calculating total product cost
        }

        if (this.totalCost > 200) {                                //calculation of applicable discounts
            this.discount["flat_10_discount"] = 10;
        }

        if (this.totalQuantity > 20) {
            this.discount["bulk_10_discount"] = this.totalCost * 0.1;
        }

        for (let [key, value] of Object.entries(this.cartItems)) {            //selection of most beneficial discount
            if (value > 10) {
                if ("bulk_5_discount" in this.discount) {
                    this.discount["bulk_5_discount"] += (products[key] * value) * 0.05;
                } else {
                    this.discount["bulk_5_discount"] = (products[key] * value) * 0.05;
                }
            }

            if (value > 15 && this.totalQuantity > 30) {
                let discountUnits = value - 15;

                if ("tiered_50_discount" in this.discount) {
                    this.discount["tiered_50_discount"] += (products[key] * discountUnits) * 0.5;
                } else {
                    this.discount["tiered_50_discount"] = (products[key] * discountUnits) * 0.5;
                }
            }
        }

        let discountName = "";
        let amount = 0;

        for (let [key, value] of Object.entries(this.discount)) {
            if (value > amount) {
                discountName = key;
                amount = value;
            }
        }

        this.selectedDiscount[discountName] = amount;

        for (let [key, value] of Object.entries(this.giftItemsCart)) {       //wrapping fee
            this.wrappingFee += value;       
        }
    }
}





function selectProducts() {
    let cart1 = new Cart();
    let doneSelection = false;

    while (!doneSelection) {                                      //displaying products until user quits
        for (let [key, value] of Object.entries(products)) {
            console.log(`${Object.keys(products).indexOf(key) + 1}. ${key}: ${value}`);
        }

        let selectedProduct = readlineSync.question("Select your Product / (q - quit): ");

        if (!isNaN(selectedProduct)) {
            selectedProduct = parseInt(selectedProduct);
        } else {
            if (selectedProduct.toUpperCase() === "Q") {
                break;
            } else {
                console.log("Invalid input");
                continue;
            }
        }

        if (selectedProduct < 1 || selectedProduct > Object.keys(products).length) {
            console.log("Product selection is not valid, select a valid one.");
            continue;
        }

        let selectedQuantity = parseInt(readlineSync.question("Enter the quantity you want: "));
        let giftWrapping = readlineSync.question("Do you want to wrap this product as a gift? (Y/N): ");

        if (giftWrapping.toUpperCase() === "Y") {
            giftWrapping = true;
        } else if (giftWrapping.toUpperCase() === "N") {
            giftWrapping = false;
        } else {
            giftWrapping = null;
        }

        cart1.addToCart(Object.keys(products)[selectedProduct - 1], selectedQuantity, giftWrapping);        //adding selected product to cart
    }

    cart1.calculateDiscount();                  //calculating discount 
    cart1.displayCart();                       //showing cart
}

selectProducts();



