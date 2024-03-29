const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProd = await Product.findAll({
      include: [
        {
          model: Category, attributes: ["category_name"], as: "category"
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["tag_name"]

        }
      ]
    })
    const allProdPlain = allProd.map(prod => prod.get({ plain: true }))
    return res.status(200).json({ allProdPlain })
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const oneProd = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category, attributes: ["category_name"], as: "category"
        },
        {
          model: Tag,
          as: "tags",
          attributes: ["tag_name"]
        }
      ]
    })
    const oneProdPlain = oneProd.get({ plain: true })
    return res.status(200).json(oneProdPlain)
  } catch (err) {
    return res.status(500).json(err)
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product

// {
//   "product_name": "Self Help Book",
//   "price": 5.00,
//   "stock": 300,
//   "category_id": 6,
//   "tagIds": [6]
// }

router.post('/', (req, res) => {
  console.log(req.body)
 Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const prodDel = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!prodDel) {
      res.status(404).json({ message: "Product not found" })
      return
    }
    res.status(200).json(prodDel)
  } catch (err) {
    res.status(500).json(err)
  }
  // delete one product by its `id` value
});

module.exports = router;










