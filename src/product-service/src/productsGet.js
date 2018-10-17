module.exports = async function getInventoryList(req) {
  let items;
  try {
    items = await req.mongo.db
      .collection("inventory")
      .find({})
      .toArray();
  } catch (e) {
    console.error("e", e);
  }

  return {
    items
  };
};
