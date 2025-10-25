import React from 'react';
import { motion } from 'framer-motion';
import '../styles/SearchResults.css';

const SearchResults = ({ results, query, images = [] }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const displayUrlName = (url) => {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0];
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      className="search-results"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="search-results-header">
        <h3 className="search-results-title">
          🔍 Search Results for "{query}"
        </h3>
        <span className="search-results-count">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {images && images.length > 0 && (
        <div className="search-images">
          <h4 className="search-images-title">Images</h4>
          <div className="search-images-grid">
            {images.slice(0, 6).map((image, index) => (
              <motion.div
                key={index}
                className="search-image-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={typeof image === 'string' ? image : image.url}
                  alt={typeof image === 'object' ? image.description : `Search result ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="search-results-list">
        {results.map((result, index) => (
          <motion.div
            key={index}
            className="search-result-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="search-result-header">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="search-result-title"
              >
                {result.title || 'Untitled'}
              </a>
              <span className="search-result-domain">
                {displayUrlName(result.url)}
              </span>
            </div>
            <p className="search-result-content">
              {result.content?.substring(0, 200)}
              {result.content?.length > 200 ? '...' : ''}
            </p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="search-result-url"
            >
              {result.url}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;