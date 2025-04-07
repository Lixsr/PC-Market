import { getCategories } from "@/lib/actions/product.actions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categories = await getCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle className="my-4">Select a category</DrawerTitle>
          <div className="space-y-1">
            {categories.map((c) => (
              <Button
                className="w-full justify-start"
                variant="ghost"
                key={c.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${c.category}`}>
                    {c.category} ({c._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
