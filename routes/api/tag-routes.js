const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [Product]
    })
    console.log(allTags)
    const allTagsPlain = allTags.map(tags => tags.get({ plain: true }))
    return res.status(200).json({ allTagsPlain })
  } catch (err) {
    return res.status(500).json(err)
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const oneTag = await Tag.findByPk(id, {
      include: [Product]
    })
    if (!oneTag) {
      return res.status(200).json({ message: "This Tag doesn't exist" })
    }
    const oneTagPlain = oneTag.get({ plain: true })
    return res.status(200).json(oneTagPlain)
  } catch (err) {
    return res.status(500).json(err)
  }

  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => { //Needs finished
  try {
    const tagName = req.body.tag_name
    const newTag = await Tag.create({ Tag: tagName })
    const newTagPlain = newTag.get({ plain: true })
    console.log(newTagPlain, "newTagPlain")
    return res.status(200).json({ newTagPlain })
  } catch (err) {
    return res.status(500).json(err)
  }
  // return res.status(200).json({message: "working?"})
  // create a new tag
});

router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      },
    })
    if(!updateTag[0]) {
      res.status(400).json({message: "Tag not updated"})
      return
    }
    res.status(200).json(updateTag)
  } catch (err) {
    res.status(500).json(err)
  }
  // return res.status(200).json({message: "working?"})
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const delTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    return res.status(200).json({delTag})
  } catch (err) {
    return res.status(500).json(err)
  }  
  // return res.status(200).json({message: "working?"})
  // delete on tag by its `id` value
});

module.exports = router;
