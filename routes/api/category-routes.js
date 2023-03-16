const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const allCat = await Category.findAll({
    include: [Product]
  })
  console.log(allCat)
  const allCatPlain = allCat.map(cat => cat.get({plain: true})) //if an array of objects
  return res.status(200).json(allCatPlain)
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const oneCat = await Category.findByPk(id,{
    include: [Product]
  })
  if(!oneCat) {
    return res.status(404).json({message: "This doesn't exist"})
  }
  console.log(oneCat, "oneCat")
  const oneCatPlain = oneCat.get({plain: true})
  return res.status(200).json(oneCatPlain)
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  try {
  const catName = req.body.category_name
  const newCat = await Category.create({category_name: catName})
  const newCatPlain = newCat.get({plain: true})
  return res.status(200).json({newCatPlain})
  } catch (err) {
    return res.status(400).json({message: "Category was not created"})
  }// create a new category
});

router.put('/:id', async (req, res) => {
  try {
  const updateCat = await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  if (!updateCat[0]) {
    res.status(200).json({message: "Category not updated"})
    return
  }
  res.status(200).json(updateCat)
} catch (err) {
  res.status(500).json({message: "err"})
}
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
  const delCat = await Category.destroy({
    where: {
      id: req.params.id
    }
    })
  return res.status(200).json({delCat})
  } catch (err) {
    return res.status(400).json({message: "Category was not deleted"})
  }
  // delete a category by its `id` value
});

module.exports = router;
