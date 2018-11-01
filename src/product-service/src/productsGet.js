module.exports = async function getInventoryList(req) {
  let items;
  const pageSize = +req.query.pageSize || 1000;
  const page = +req.query.page || 0;

  const collection =
    process.env.COLLECTION_NAME ||
    req.keyvault.secrets["COLLECTION-NAME"] ||
    "inventory";
  try {
    items = await req.mongo.db
      .collection(collection)
      .find()
      .limit(pageSize)
      .skip(pageSize * page)
      .toArray();
  } catch (e) {
    console.error("e", e);
  }

  return {
    items
  };
};
