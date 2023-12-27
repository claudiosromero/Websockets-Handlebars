import { promises as fs } from 'fs'
import { nanoid } from 'nanoid' // genera id automaticos
import ProductManager from './ProductManager.js'

const productALL = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json"

    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

    exist = async (id) => {
        let carts = await this.readCarts()
        return carts.find(cart => cart.id === id) //retorna ID
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts()
        let id = nanoid()
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito Creado"
    }

    getCartById = async (id) => {

        let cartById = await this.exist(id)
        if (!cartById) return "El carrito no Existe" // Cuando no encuentra ID
        return cartById
    }

    // La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products”
    addProductInCart = async (cartId, producId) => {
        let cartById = await this.exist(cartId)
        if (!cartById) return "El carrito no Existe"
        let producById = await productALL.exist(producId)
        if (!cartById) return "El producto no Existe"

        let cartAll = await this.readCarts()
        let cartFilter = cartAll.filter(cart => cart.id != cartId)

        //validacion y sumar cantidad

        if (cartById.products.some(prod => prod.id === producId)) {
            let productInCart = cartById.products.find(prod => prod.id === producId)
            productInCart.cantidad++
            let cartsConcat = [productInCart, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto sumado al Carrito"
        }

        //sumar producto nuevo
        cartById.products.push({ id: producById.id, cantidad: 1 })
        let cartsConcat = [productInCart, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto Agregado al Carrito"
    }
}

export default CartManager