import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./Menu";
import CategoryDrawer from "./CategoryDrawer";
import Search from "./Search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} Logo`}
              height={48}
              width={48}
              priority={true}
              style={{ cursor: "pointer" }}
            />
            <span className="lg:block hidden font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block ml-auto mr-8">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
