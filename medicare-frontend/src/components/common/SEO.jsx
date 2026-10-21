import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Enterprise Dynamic SEO Component
 * Automatically updates Title, Meta Description, Open Graph tags, Canonical URL, and JSON-LD Structured Data
 */
export default function SEO({
  title = "MediCore Healthcare",
  description = "Modern healthcare management platform offering real-time specialist consultation booking and electronic clinical records.",
  canonical = "",
  schema = null,
}) {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes("MediCore") ? title : `${title} | MediCore Healthcare`;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute, name, content) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard Description
    setMetaTag("name", "description", description);

    // Open Graph Tags
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);

    // Twitter Card Tags
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);

    // 3. Update Canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "canonical");
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute("href", canonical);
    }

    // 4. Update or Inject Page-Specific JSON-LD Schema
    const existingSchemaScript = document.getElementById("page-dynamic-schema");
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "page-dynamic-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const toRemove = document.getElementById("page-dynamic-schema");
      if (toRemove) toRemove.remove();
    };
  }, [title, description, canonical, schema]);

  return null;
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  canonical: PropTypes.string,
  schema: PropTypes.object,
};
