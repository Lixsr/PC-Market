import ProductList from "@/components/products/ProductList";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <div>
      <ProductList data={latestProducts} title="Newest Products" />
    </div>
  );
};

export default Homepage;
