import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AboutPage = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const storeLocation = [24.187013548429054, 120.59540578170161];

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        storeLocation,
        17
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      L.marker(storeLocation)
        .addTo(mapRef.current)
        .bindPopup("椅購王 - 台中市龍井區國際街131號")
        .openPopup();

      const handleResize = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-10 text-foreground text-center sm:text-left">
        {t("about.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
        <div className="space-y-6">
          <section className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md border border-border transition-all hover:shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              {t("about.story")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("about.storyContent")}
            </p>
          </section>

          <section className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md border border-border transition-all hover:shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              {t("about.contact")}
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                {t("about.address")}
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                {t("about.phone")}
              </li>
              <li className="flex items-center">
                <span className="mr-2">🕒</span>
                {t("about.hours")}
              </li>
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md border border-border transition-all hover:shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              {t("about.services")}
            </h2>
            <ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
              <li className="flex items-center">
                <span className="mr-2">✨</span>
                {t("about.servicesList.manufacturing")}
              </li>
              <li className="flex items-center">
                <span className="mr-2">🏢</span>
                {t("about.servicesList.commercial")}
              </li>
              <li className="flex items-center">
                <span className="mr-2">🎨</span>
                {t("about.servicesList.custom")}
              </li>
              <li className="flex items-center">
                <span className="mr-2">💡</span>
                {t("about.servicesList.consultation")}
              </li>
            </ul>
          </section>

          <section className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md border border-border transition-all hover:shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
              {t("about.quality")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t("about.qualityContent")}
            </p>
          </section>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground text-center sm:text-left">
          {t("about.contact")}
        </h2>
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg shadow-md border border-border overflow-hidden"
        />
      </div>
    </div>
  );
};

export default AboutPage;
