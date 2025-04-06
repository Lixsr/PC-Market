"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const AdminSearchForm = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
    ? "/admin/users"
    : "/admin/products";
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }
  return <form action={formActionUrl} method='GET'>
  <Input
    type='search'
    placeholder='Search...'
    name='query'
    value={query}
    onChange={handleChange}
    className='md:w-[200px] lg:w-[325px]'
  />
  {/* For screen readers */}
  <button type='submit' className='sr-only'>
    Search
  </button>
</form>;
};

export default AdminSearchForm;
