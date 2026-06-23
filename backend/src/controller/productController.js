import prisma from "../../lib/prisma.js";

const viewProduct = async (req, res) => {
  const {storeName} = req.body
  const product = await prisma.product.findMany({
    where: {
      vendor: {
        store: {
          name: storeName
        }
      }
    }
  })
  console.log(product)
   res.json(product)
}

export {viewProduct};