const sampleData = {
  products: [
    {
      name: "RTX 4090",
      slug: "rtx-4090",
      category: "Graphics Cards",
      description:
        "The ultimate gaming and creative performance with NVIDIA’s RTX 4090",
      images: [
        "/images/sample-products/p1-1.jpg",
        "/images/sample-products/p1-2.jpg",
      ],
      price: 1599.99,
      brand: "NVIDIA",
      rating: 4.9,
      numReviews: 25,
      stock: 3,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      name: "RTX 4090 White",
      slug: "rtx-4090-white",
      category: "Graphics Cards",
      description: "Limited edition white variant of the powerful RTX 4090",
      images: [
        "/images/sample-products/p2-1.jpg",
        "/images/sample-products/p2-2.jpg",
      ],
      price: 1699.99,
      brand: "NVIDIA",
      rating: 4.8,
      numReviews: 15,
      stock: 2,
      isFeatured: true,
      banner: "banner-2.jpg",
    },
    {
      name: "High-End PC",
      slug: "high-end-pc",
      category: "Prebuilt PCs",
      description:
        "A powerhouse PC built for gaming, streaming, and productivity",
      images: [
        "/images/sample-products/p3-1.jpg",
        "/images/sample-products/p3-2.jpg",
      ],
      price: 2999.99,
      brand: "Custom Build",
      rating: 4.7,
      numReviews: 30,
      stock: 5,
      isFeatured: false,
      banner: null,
    },
    {
      name: "TridentZ5 RAMs",
      slug: "tridentz5-rams",
      category: "Memory (RAM)",
      description:
        "High-performance DDR5 memory for gaming and professional workloads",
      images: [
        "/images/sample-products/p4-1.jpg",
        "/images/sample-products/p4-2.jpg",
      ],
      price: 199.99,
      brand: "G.Skill",
      rating: 4.6,
      numReviews: 20,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: "ROG 1200W PSU",
      slug: "rog-1200w-psu",
      category: "Power Supplies",
      description: "High-efficiency power supply for extreme gaming rigs",
      images: [
        "/images/sample-products/p5-1.jpg",
        "/images/sample-products/p5-2.jpg",
      ],
      price: 299.99,
      brand: "ASUS ROG",
      rating: 4.5,
      numReviews: 18,
      stock: 7,
      isFeatured: false,
      banner: null,
    },
    {
      name: "LT Liquid Cooler",
      slug: "lt-liquid-cooler",
      category: "Cooling Systems",
      description: "Advanced liquid cooling solution for high-performance CPUs",
      images: [
        "/images/sample-products/p6-1.jpg",
        "/images/sample-products/p6-2.jpg",
      ],
      price: 149.99,
      brand: "LiquidTech",
      rating: 4.4,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
