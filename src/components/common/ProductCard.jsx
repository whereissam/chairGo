import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover flex-shrink-0"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </Link>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
