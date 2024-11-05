import { useTranslation } from "react-i18next";
import { useState } from "react";
import toast from "react-hot-toast";

function FAQ() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_GOOGLE_CONTACT_SCRIPT_URL,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
            source: "FAQ Contact Form",
          }),
        }
      );

      setFormData({ name: "", email: "", question: "" });
      toast.success(t("footer.faqContent.formSuccess"));
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("footer.faqContent.formError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("footer.faqContent.title")}
      </h1>

      {/* FAQ Questions */}
      <div className="space-y-6 mb-12">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">
            {t("footer.faqContent.q1")}
          </h2>
          <p className="text-muted-foreground">{t("footer.faqContent.a1")}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">
            {t("footer.faqContent.q2")}
          </h2>
          <p className="text-muted-foreground">{t("footer.faqContent.a2")}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">
            {t("footer.faqContent.q3")}
          </h2>
          <p className="text-muted-foreground">{t("footer.faqContent.a3")}</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">
          {t("footer.faqContent.askQuestion")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t("footer.faqContent.formName")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("footer.faqContent.formEmail")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium mb-2"
            >
              {t("footer.faqContent.formQuestion")}
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting
              ? t("footer.faqContent.formSubmitting")
              : t("footer.faqContent.formSubmit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FAQ;
