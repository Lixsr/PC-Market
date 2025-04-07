import Pagination from "@/components/shared/Pagination";
import ProductCard from "@/components/shared/products/ProductCard";
import { getAllProducts, getCategories } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import Link from "next/link";
import { PRICES } from "@/lib/constants";
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

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { query, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };
  const { products, totalPages } = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: parseInt(page),
  });

  const categories = await getCategories();
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* Filter Links */}
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mt-3 mb-2">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  ("all" === category || "" === category) && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${
                    x.category === category && "font-bold underline"
                  }`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div>
          <div className="text-xl mt-8 mb-2">Price</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`  ${"all" === price && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {PRICES.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`${p.value === price && "font-bold underline"}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products?.length === 0 && <div>No product found</div>}
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages! > 1 && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </div>
  );
};

export default SearchPage;
