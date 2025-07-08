// src/pages/SearchResultPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { toast } from 'react-toastify';
import { Loader, SearchX } from 'lucide-react';

const PORT = 5000;

const SearchResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //pull the page attention to the top of the page when first loaded
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);


  const parseQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get('q') || '',
      category: params.get('category') || null,
      minPrice: parseFloat(params.get('minPrice')) || 0,
      maxPrice: parseFloat(params.get('maxPrice')) || 10000000,
      usedFor: params.get('usedFor') || null,
      division: params.get('division') || null,
      district: params.get('district') || null,
      ward: params.get('ward') || null,
      area: params.get('area') || null,
      userId: localStorage.getItem('user_id') || null,
    };
  }, [location.search]);

  const [searchParams, setSearchParams] = useState(parseQueryParams);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const currentParams = parseQueryParams();
    if (JSON.stringify(searchParams) !== JSON.stringify(currentParams)) {
      setSearchParams(currentParams);
    }
  }, [location.search, parseQueryParams]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:${PORT}/api/categories`);
        setAvailableCategories(res.data);
      } catch (err) {
        console.error("Error fetching all categories for filters:", err);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const queryApiParams = {
        q: searchParams.q,
        userId: searchParams.userId,
        category: searchParams.category,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        usedFor: searchParams.usedFor,
        division: searchParams.division,
        district: searchParams.district,
        ward: searchParams.ward,
        area: searchParams.area,
      };

      try {
        const res = await axios.get(`http://localhost:${PORT}/api/products/search/all`, {
          params: queryApiParams,
        });
        setProducts(res.data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
        toast.error("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    const updateUrl = () => {
      const params = new URLSearchParams();
      if (searchParams.q) params.set('q', searchParams.q);
      if (searchParams.category) params.set('category', searchParams.category);
      if (searchParams.minPrice !== 0) params.set('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice !== 10000000) params.set('maxPrice', searchParams.maxPrice);
      if (searchParams.usedFor) params.set('usedFor', searchParams.usedFor);
      if (searchParams.division) params.set('division', searchParams.division);
      if (searchParams.district) params.set('district', searchParams.district);
      if (searchParams.ward) params.set('ward', searchParams.ward);
      if (searchParams.area) params.set('area', searchParams.area);
      if (searchParams.userId) params.set('userId', searchParams.userId);

      navigate(`?${params.toString()}`, { replace: true });
    };

    const handler = setTimeout(() => {
      updateUrl();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams, navigate]);

  const handleFilterChange = (filterName, value) => {
    setSearchParams(prevParams => {
      const newParams = { ...prevParams, [filterName]: value };
      if (filterName === 'division') {
        newParams.district = null;
        newParams.ward = null;
        newParams.area = null;
      } else if (filterName === 'district') {
        newParams.ward = null;
        newParams.area = null;
      } else if (filterName === 'ward') {
        newParams.area = null;
      }
      return newParams;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white font-inter">
      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto">
        <div className="text-center mb-8">
          {error ? (
            <div className="max-w-2xl mx-auto text-center px-4 py-4 bg-red-500/10 border border-red-400 text-red-200 backdrop-blur-md rounded-xl shadow-md">
              <p className="text-base font-medium">{error}</p>
            </div>
          ) : (
            <p className="text-2xl font-semibold">
              {loading ? (
                <>Searching...</>
              ) : (
                <>
                  {products.length} Results
                  {searchParams.q && ` for '${searchParams.q}'`}
                  {searchParams.category && ` in '${searchParams.category}' category`}
                  {(searchParams.division || searchParams.district || searchParams.ward || searchParams.area) &&
                    ` near ${[searchParams.area, searchParams.division, searchParams.district, searchParams.ward]
                      .filter(Boolean)
                      .reverse()
                      .join(', ')}`}
                  {(searchParams.minPrice > 0 || searchParams.maxPrice < 10000000) &&
                    ` (Price: ৳${searchParams.minPrice.toLocaleString()} - ৳${searchParams.maxPrice.toLocaleString()})`}
                  {searchParams.usedFor && ` (Condition: ${searchParams.usedFor.replace(/_/g, ' ')})`}
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 p-4 bg-slate-800 rounded-xl shadow-lg">
            <FilterSidebar
              searchParams={searchParams}
              onFilterChange={handleFilterChange}
              availableCategories={availableCategories}
            />
          </aside>

          <section className="md:w-3/4 flex flex-col items-center justify-center min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader className="h-20 w-20 text-blue-500 animate-spin" />
                <p className="mt-4 text-lg text-gray-400">Fetching products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <style>
                  {`
                  @keyframes bounce-icon {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-10px);
                    }
                  }
                  .animate-bounce-icon {
                    animation: bounce-icon 1s ease-in-out infinite;
                  }
                `}
                </style>
                <SearchX className="h-24 w-24 mb-4 text-gray-500 animate-bounce-icon" />
                <p className="text-2xl font-semibold mb-2">No products found.</p>
                <p className="text-lg text-center">Please try adjusting your search filters or terms.</p>
              </div>
            ) : (
              <ProductGrid products={products} title="Search Results" />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultPage;
