import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { toast } from 'react-toastify';

const PORT = 5000; // Define your backend port here

/**
 * SearchResultPage component displays products based on search queries and filters.
 * It manages search parameters from the URL, fetches products, and updates the URL
 * when filters are applied.
 */
const SearchResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Parses URL query parameters into a searchParams object.
     * Uses useCallback to memoize the function, only recreating if location.search changes.
     * @returns {object} An object containing parsed search parameters.
     */
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
            ward: params.get('ward') || null, // Corresponds to Upazila
            area: params.get('area') || null, // Corresponds to Union
            userId: localStorage.getItem('user_id') || null,
        };
    }, [location.search]); // Dependent on location.search, will re-create if URL changes

    // State for all search and filter parameters.
    // Initialize DIRECTLY using the parseQueryParams function to reflect URL on mount.
    const [searchParams, setSearchParams] = useState(parseQueryParams);

    // State for fetched products, loading, and error
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to hold available categories for the filter sidebar dropdown
    const [availableCategories, setAvailableCategories] = useState([]);

    // --- Effect: Re-sync searchParams state from URL when location.search changes ---
    // This handles cases like back/forward browser navigation where the URL changes
    // without a direct filter interaction in the app.
    useEffect(() => {
        const currentParams = parseQueryParams();
        // Only update state if parameters have actually changed to avoid unnecessary re-renders
        // Using JSON.stringify for a deep comparison, assuming simple objects.
        if (JSON.stringify(searchParams) !== JSON.stringify(currentParams)) {
            setSearchParams(currentParams);
        }
    }, [location.search, parseQueryParams]); // Removed searchParams from dependencies here

    // --- Effect: Fetch all categories for the filter sidebar dropdown ---
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                // Assuming your backend /api/categories returns an array directly
                const res = await axios.get(`http://localhost:${PORT}/api/categories`);
                setAvailableCategories(res.data);
            } catch (err) {
                console.error("Error fetching all categories for filters:", err);
                // toast.error("Could not load category filter options."); // Uncomment if you want user notification
            }
        };
        fetchAllCategories();
    }, []); // Runs once on component mount

    // --- Effect: Fetch products based on current searchParams state ---
    // This effect runs whenever searchParams changes, triggering a new product fetch.
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            // Construct API parameters from current searchParams state
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
                    params: queryApiParams
                });

                // Assuming backend response is { products: [], proximityUsed: boolean }
                setProducts(res.data.products);

                // Determine appropriate error message if no products are found
                const hasActiveFilters = Object.entries(searchParams).some(([key, value]) =>
                    // Exclude 'q' and 'userId' if empty, and default price values
                    (key !== 'q' && key !== 'userId' && value !== null && value !== '' && value !== 0 && value !== 10000000) ||
                    // Include 'q' if it has a value
                    (key === 'q' && value !== '')
                );

                if (res.data.products.length === 0) {
                    if (hasActiveFilters) {
                        setError("0 Products found with the applied filters.");
                    } else {
                        setError("No products available."); // If no filters, and still empty
                    }
                } else {
                    setError(null); // Clear error if products are found
                }

            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products. Please try again later.");
                toast.error("Failed to fetch search results.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]); // Depend on searchParams, so it refetches when filters or query change

    // --- Effect: Update URL query parameters based on searchParams state (with debounce) ---
    // This effect ensures the URL reflects the current filter state,
    // with a debounce to prevent excessive URL updates during rapid typing/selection.
    useEffect(() => {
        const updateUrl = () => {
            const params = new URLSearchParams();
            if (searchParams.q) params.set('q', searchParams.q);
            if (searchParams.category) params.set('category', searchParams.category);
            // Only add price params if they are not default values
            if (searchParams.minPrice !== 0) params.set('minPrice', searchParams.minPrice);
            if (searchParams.maxPrice !== 10000000) params.set('maxPrice', searchParams.maxPrice);
            if (searchParams.usedFor) params.set('usedFor', searchParams.usedFor);
            if (searchParams.division) params.set('division', searchParams.division);
            if (searchParams.district) params.set('district', searchParams.district);
            if (searchParams.ward) params.set('ward', searchParams.ward);
            if (searchParams.area) params.set('area', searchParams.area);
            if (searchParams.userId) params.set('userId', searchParams.userId); // userId should always be passed if available

            // Use navigate with replace: true to prevent adding multiple history entries
            navigate(`?${params.toString()}`, { replace: true });
        };

        const handler = setTimeout(() => {
            updateUrl();
        }, 300); // Debounce: wait 300ms before updating URL

        return () => {
            clearTimeout(handler); // Cleanup the timeout if searchParams changes before the delay
        };
    }, [searchParams, navigate]); // Depend on searchParams, so it triggers when filters change

    /**
     * Handler for filter changes from the sidebar.
     * Updates the searchParams state, and resets dependent address fields if a higher-level
     * address filter is changed (e.g., changing division resets district, ward, and area).
     * @param {string} filterName - The name of the filter to update (e.g., 'category', 'division').
     * @param {any} value - The new value for the filter.
     */
    const handleFilterChange = (filterName, value) => {
        setSearchParams(prevParams => {
            const newParams = { ...prevParams, [filterName]: value };

            // Reset dependent address fields if a higher-level address filter changes
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

    // --- Render Logic ---
    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white font-inter">
            <Header />

            <main className="flex-grow px-4 py-8 container mx-auto">
                {/* Search Summary Section */}
                <div className="text-center mb-8">
                    {loading ? (
                        <p className="text-xl text-gray-400">Searching products...</p>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto text-center px-4 py-4 bg-red-500/10 border border-red-400 text-red-200 backdrop-blur-md rounded-xl shadow-md">
                            <p className="text-base font-medium">{error}</p>
                        </div>
                    ) : (
                        // Display search summary if products are found
                        <p className="text-2xl font-semibold">
                            {products.length} Results
                            {searchParams.q && ` for '${searchParams.q}'`}
                            {searchParams.category && ` in '${searchParams.category}' category`}
                            {(searchParams.division || searchParams.district || searchParams.ward || searchParams.area) &&
                                ` near ${[searchParams.area, searchParams.division, searchParams.district, searchParams.ward]
                                    .filter(Boolean)
                                    .reverse() // Display from broader to specific location for readability
                                    .join(', ')}`}
                            {(searchParams.minPrice > 0 || searchParams.maxPrice < 10000000) &&
                                ` (Price: ৳${searchParams.minPrice.toLocaleString()} - ৳${searchParams.maxPrice.toLocaleString()})`}
                            {searchParams.usedFor && ` (Condition: ${searchParams.usedFor.replace(/_/g, ' ')})`}
                        </p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="md:w-1/4 p-4 bg-slate-800 rounded-xl shadow-lg">
                        <FilterSidebar
                            searchParams={searchParams}
                            onFilterChange={handleFilterChange}
                            availableCategories={availableCategories}
                        />
                    </aside>

                    {/* Product Grid (Main Content Area) */}
                    <section className="md:w-3/4">
                        {loading ? (
                            <p className="text-center text-gray-400">Loading products...</p>
                        ) : (
                            // Always pass the products state to ProductGrid,
                            // error message is handled in the summary section above.
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
