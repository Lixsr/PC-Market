import ProductList from "@/components/products/ProductList";
import sampleData from "@/db/sample-data";

const Homepage = () => {
  return (
    <div>
      <ProductList
        data={sampleData.products}
        title="Newest Products"
        limit={5}
      />
    </div>
  );
};

export default Homepage;
