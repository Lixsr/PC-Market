import Pagination from "@/components/shared/Pagination";
import ProductCard from "@/components/shared/products/ProductCard";
import { getAllProducts } from "@/lib/actions/product.actions";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Search",
};

const SearchPage = async (props: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    query = "",
    category = "all",
    price = "all",
    rating = "all",
    sort = "recent",
    page = "1",
  } = await props.searchParams;
  const {products, totalPages} = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: parseInt(page),
  });
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* FILTERS */}</div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products?.length === 0 && <div>No product found</div>}
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {totalPages! > 1 && (
          <Pagination page={page} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
