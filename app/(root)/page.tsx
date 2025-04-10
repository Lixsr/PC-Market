import ProductList from "@/components/shared/products/ProductList";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/products/ProductCarousel";
import ViewAllProductsButton from "@/components/shared/ViewAllProductsButton";
import DealCountdown from "@/components/DealCountdown";
import ServiceHighlights from "@/components/ServiceHighlights";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const dealEndingTime = new Date("2026-12-20T00:00:00");
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

      {/* Deal Countdown */}
      <div className="my-10">
        <DealCountdown
          dealEndingTime={dealEndingTime}
          promoImageUrl="/images/promo.jpg"
        />
      </div>
      {/* Services */}
      <div className="my-10">
        <ServiceHighlights />
      </div>
    </div>
  );
};

export default Homepage;
