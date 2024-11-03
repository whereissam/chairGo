function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <p className="text-center">
          © {new Date().getFullYear()} Furniture Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
