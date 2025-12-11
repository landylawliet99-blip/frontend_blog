// frontend_blog/src/components/MetaTags.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title = 'Laptops Gaming Blog - Reviews, Análisis y Guías',
  description = 'Tu fuente confiable de reviews, análisis y guías sobre las mejores laptops gaming del mercado. Encuentra comparativas, benchmarks y ofertas exclusivas.',
  keywords = 'laptops gaming, gaming laptops, reviews, análisis, guías compra, ofertas laptops, RTX, gaming',
  author = 'Laptops Gaming Blog',
  url = window.location.href,
  image = '/logo.png',
  type = 'website',
  publishedTime = '',
  modifiedTime = '',
  category = 'Tecnología'
}) => {
  const siteName = 'Laptops Gaming Blog';
  const twitterHandle = '@LaptopsGamingBlog';
  const fbAppId = '';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "BlogPosting" : "WebSite",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": image
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "genre": category
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_ES" />
      {fbAppId && <meta property="fb:app_id" content={fbAppId} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      <link rel="canonical" href={url} />
      
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      
      <meta httpEquiv="content-language" content="es" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default MetaTags;