import { Card } from "../ui/card";

function ProductList({ products, onSelect, selectedId }) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === product.id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => onSelect(product)}
        >
          <div className="flex gap-4 p-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">
                ${product.price.toFixed(2)}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full
                  ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ProductList;
