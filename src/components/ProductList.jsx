import React, { useEffect, useRef, useState } from "react";
import { Product } from "../Product";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasmore] = useState(true);
  const loaderRef = useRef(null);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products?limit=${productsPerPage}&skip=${
            page * productsPerPage
          }`
        );
        if (!response.ok) {
          throw new Error(`Error fetching products. ${response.statusCode} `);
        }
        const data = await response.json();
        if (data.products.length === 0) {
          setHasmore(false);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.products]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    const observer = new IntersectionObserver((items) => {
      const loaderItem = items[0];
      if (loaderItem.isIntersecting && hasMore) {
        fetchedProducts();
      }
    });
    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    //cleanup
    return () => {
      if (observer) observer.disconnect();
    };
  }, [hasMore, page]);
  return (
    <div className="max-w-2xl mx-auto py-4">
      <h2 className="text-2xl font-semibold">Product List</h2>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
      {hasMore && (
        <div ref={loaderRef} className="text-2xl font-semibold">
          Loading more products...
        </div>
      )}
    </div>
  );
}
