import ProductList from "@/components/shared/products/ProductList";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/products/ProductCarousel";
import ViewAllProductsButton from "@/components/shared/ViewAllProductsButton";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* <ProductCarousel /> */}
      {featuredProducts.length > 0 && (
        <ProductCarousel featuredProducts={featuredProducts} />
      )}
      {/* Products List */}
      <ProductList data={latestProducts} title="Newest Products" />
      {/* View All Products */}
      <ViewAllProductsButton />
    </div>
  );
};

export default Homepage;
