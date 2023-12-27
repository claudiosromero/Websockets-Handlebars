import { promises as fs } from 'fs'
import { nanoid } from 'nanoid' // genera id automaticos

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json"
    }

    //metodo para leer los productos
    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }


    writeProduts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }
    //funcion auxiliar

    exist = async (id) => {
        let products = await this.readProducts()
        return products.find(prod => prod.id === id) //retorna ID
    }

    addProducts = async (product) => {
        let productsOLD = await this.readProducts() //consulta los productos
        product.id = nanoid()
        let productALL = [...productsOLD, product]
        await this.writeProduts(productALL)
        return "Producto Agregado"
    }

    getProducts = async () => {

        return await this.readProducts()

    }

    getProductsById = async (id) => {

        let productsById = await this.exist(id)
        if (!productsById) return "El producto no Existe" // Cuando no encuentra ID
        return productsById
    }





    // actualizar producto

    updateProduct = async (id, product) => {
        let productsById = await this.exist(id)
        if (!productsById) return "El producto no Existe" // Cuando no encuentra ID

        await this.deleteProducts(id) // borro el producto original
        let productOld = await this.readProducts() // traigo todos los productos menos el que modificaremos que lo borra por completo

        let products = [{ ...product, id: id }, ...productOld] // sumo a los productos el nuevo modificado
        await this.writeProduts(products)

    }


    deleteProducts = async (id) => {
        let products = await this.readProducts()
        // arreglo para eliminar
        let existProducs = products.some(prod => prod.id === id)
        if (existProducs) {
            let filterProducts = products.filter(prod => prod.id != id) //llamo a los productos que no quiero eliminar
            await this.writeProduts(filterProducts) //le pido que escriba el arreglo sobre el jason y de esta manera escxribne todo menos el que filtre y se descarta ese ID
            return "Producto Eliminado"
        }

        return "No existe el producto que desea eliminar"

    }


}

export default ProductManager

