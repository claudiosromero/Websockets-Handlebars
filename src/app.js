import express from "express"
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js"
import { engine } from "express-handlebars"
import * as path from "path"
import __dirname from "./utils.js"
import ProductManager from "./controllers/ProductManager.js"

const app = express()
const PORT = 8080
const product = new ProductManager()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Handlebars

app.engine("handlebars", engine())
app.set("view engine", "handelebars")
app.set("views", path.resolve(__dirname + "views"))

//static
app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
    let allProducts = await product.getProducts()
    res.render("home", {
        title: "Express Avanzado",
        products: allProducts
    })
})

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)


app.listen(PORT, () => {
    console.log(`Servidor Express Puerto N° ${PORT}`)
})