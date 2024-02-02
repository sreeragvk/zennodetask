import math
products = {"Product A": 20, "Product B": 40, "Product C": 50} #product dictionary


class Cart:
    def __init__(self): #initializing attributes
        self.cartItems = {}
        self.totalCost = 0
        self.totalQuantity = 0
        self.discount = {}
        self.selectecdDiscount = {}
        self.GiftItemsCart = {}
        self.WrappingFee = 0
    
    def addToCart(self,productName, quantity, giftWrapping):  #addtocart method
        if productName in self.cartItems:                     #append to cart if item already exist else create new record for product
            self.cartItems[productName] += quantity
        else:
            self.cartItems[productName] = quantity
        if giftWrapping is not None:                          #adding product to gift items if wrapping is selected
            if giftWrapping:
                if productName in self.GiftItemsCart:
                    self.GiftItemsCart[productName] += quantity
                else:
                 self.GiftItemsCart[productName] = quantity
            else: 
                pass

    def displayCart(self):                                    #cart display
        print("Cart Items:")
        
        
        print('\n')
        for product, quantity in self.cartItems.items():
            print("Product: {0}, unitPrice: {1}, Quantity: {2}, Gifted Quantity: {3}".format(list(products.keys())[product-1], products[list(products.keys())[product-1]], quantity, self.GiftItemsCart[product] if product in self.GiftItemsCart.keys() else 0))
        print('\n')
        print("Total Amount: ", self.totalCost)
        print('\n')
        discountName, discountAmount = next(iter(self.selectecdDiscount.items()))
        print("Applied Discount: {},  Discount Amount: {}".format(discountName, discountAmount))
        print('\n')
        print("shipping Charge: ", (math.ceil(self.totalQuantity/10))*5)
        print('\n')
        print("Wrapping Fee: ", self.WrappingFee)
        print('\n')
        print("Payable Amount: ", (self.totalCost - discountAmount)+((math.ceil(self.totalQuantity/10))*5)+self.WrappingFee)
        
                    
    def calculateDisCount(self):                            #discount calculation
        for key, value in self.cartItems.items():
            self.totalQuantity += value
            self.totalCost += products[list(products.keys())[key-1]]*value       #calculating total product cost
            
        if(self.totalCost > 200):                                                #calculations of applicable discounts 
            self.discount["flat_10_discount"] = 10
        if self.totalQuantity > 20:
            self.discount["bulk_10_discount"] = self.totalCost * 0.1
           
        for key, value in self.cartItems.items():
            if value > 10:
                if "bulk_5_discount" in self.discount:
                    self.discount["bulk_5_discount"] += (products[list(products.keys())[key-1]]*value) * 0.05
                else: 
                    self.discount["bulk_5_discount"] = (products[list(products.keys())[key-1]]*value) * 0.05
            if value > 15 and self.totalQuantity > 30:    
                discountUnits = value - 15
                if "tiered_50_discount" in self.discount:
                    self.discount["tiered_50_discount"] += (products[list(products.keys())[key-1]]*discountUnits)*0.5
                else:
                    self.discount["tiered_50_discount"] = (products[list(products.keys())[key-1]]*discountUnits)*0.5
        discountName = ""
        Amount = 0
        for key, value in self.discount.items():                   #selection of most beneficial discount
            if value > Amount :
                discountName = key
                Amount = value
        self.selectecdDiscount[discountName] = Amount           

        for key, value in self.GiftItemsCart.items():              #wrapping fee
            self.WrappingFee += value

def selectProducts():
    cart1 = Cart()
    doneSelection = False
    while(not doneSelection):                                      #displaying products until user quits
        
        for (key, value) in products.items():
            print(list(products.keys()).index(key)+1, ".", key , ": " ,value)
        selectedProduct = (input("select your Product / (q - quit): "))
        
        
        if(selectedProduct.isdigit()):
            selectedProduct = int(selectedProduct)
        else:
            if selectedProduct.upper() == "Q":
                break
            else:
                print("invalid input")
                continue
        
        if(selectedProduct not in range(1, len(list(products.keys()))+1)):
            print("Product selection is not valid, select a valid one.")
            continue
        
        selectedQuantity = int(input("enter the quantity you want: "))
        
        giftWrapping = input("Do you want to wrap this product as a gift? (Y/N): ")
        
        if (giftWrapping.upper() == "Y"):
            giftWrapping = True
        elif(giftWrapping.upper() == "N"):
            giftWrapping = False
        else:
            giftWrapping = None

        
        cart1.addToCart(selectedProduct, selectedQuantity, giftWrapping)         #adding selected product to cart
        
    
    cart1.calculateDisCount()                                                    #calculating discount
    cart1.displayCart()                                                          #showing cart
        
        
        
  

if __name__ == "__main__":
    
    selectProducts()