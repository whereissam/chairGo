function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="flex items-center space-x-4">
        <label className="font-medium">Category:</label>
        <select
          className="border rounded-md px-3 py-1"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="font-medium">Sort by:</label>
        <select
          className="border rounded-md px-3 py-1"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
