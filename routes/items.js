const Item = require("../shoppingList");
const express = require("express");
const ExpressError = require("../expressError");

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    return res.json({ items: Item.findAll() });
  } catch (e) {
    return next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError(
        "Invalid params, name and price are required",
        400
      );
    }
    let newItem = new Item(req.body.name, req.body.price);
    return res.json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    let foundItem = Item.find(req.params.name, req.body);
    return res.json({ foundItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    let foundItem = Item.update(req.params.name, req.body);
    return res.json({ updated: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  try {
    Item.remove(req.params.name);
    return res.json({ message: "Deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
