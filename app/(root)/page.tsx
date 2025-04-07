import ProductList from "@/components/shared/products/ProductList";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/products/ProductCarousel";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* <ProductCarousel /> */}
      {featuredProducts.length > 0 && (<ProductCarousel featuredProducts={featuredProducts}/>)}
      <ProductList data={latestProducts} title="Newest Products" />
    </div>
  );
};

export default Homepage;
