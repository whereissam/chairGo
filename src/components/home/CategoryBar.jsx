function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-gray-800 text-white py-2 px-4 -mx-4">
      <div className="container mx-auto flex space-x-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedCategory === category
                ? "bg-white text-gray-800"
                : "hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;
