import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const BDAPI_BASE_URL = 'https://bdapi.vercel.app/api/v.1';

const FilterSidebar = ({ searchParams, onFilterChange, availableCategories }) => {
    // Local state for price inputs to allow users to type before applying the filter
    const [minPriceInput, setMinPriceInput] = useState(searchParams.minPrice === 0 ? '' : searchParams.minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(searchParams.maxPrice === 10000000 ? '' : searchParams.maxPrice);

    // States for cascaded address dropdown options
    // These will store objects like { id: '...', name: '...' }
    const [availableDivisions, setAvailableDivisions] = useState([]);
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableWards, setAvailableWards] = useState([]); // Upazilas mapped to Wards
    const [availableAreas, setAvailableAreas] = useState([]); // Unions mapped to Areas

    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isUsageOpen, setIsUsageOpen] = useState(true);
    const [isAddressOpen, setIsAddressOpen] = useState(true);

    useEffect(() => {
        // This ensures the input fields reflect the current filter values
        setMinPriceInput(searchParams.minPrice === 0 ? '' : searchParams.minPrice);
        setMaxPriceInput(searchParams.maxPrice === 10000000 ? '' : searchParams.maxPrice);
    }, [searchParams.minPrice, searchParams.maxPrice]);

    // --- Effect: Fetch divisions on component mount ---
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                console.log("Fetching divisions from BDAPI...");
                const res = await axios.get(`${BDAPI_BASE_URL}/division`);
                console.log("BDAPI /division full response:", res.data);

                if (res.data && Array.isArray(res.data.data)) {
                    setAvailableDivisions(res.data.data);
                } else {
                    console.error("BDAPI /division endpoint did not return expected data.data array:", res.data);
                    setAvailableDivisions([]);
                }
            } catch (err) {
                console.error("Error fetching divisions from BDAPI:", err);
            }
        };
        fetchDivisions();
    }, []); // Runs once on mount

    // --- Effect: Fetch districts when division changes in searchParams ---
    useEffect(() => {
        // Clear dependent dropdowns if division is unselected or no divisions are available yet
        if (!searchParams.division || availableDivisions.length === 0) {
            setAvailableDistricts([]);
            setAvailableWards([]);
            setAvailableAreas([]);
            return;
        }

        // Find the ID of the selected division name
        const selectedDivision = availableDivisions.find(div => div.name === searchParams.division);
        console.log("Selected division for district fetch:", searchParams.division, "found ID:", selectedDivision?.id);


        if (selectedDivision) {
            const fetchDistricts = async () => {
                try {
                    console.log(`Fetching districts for division ID: ${selectedDivision.id}...`);
                    const res = await axios.get(`${BDAPI_BASE_URL}/district/${selectedDivision.id}`);
                    console.log("BDAPI /district full response:", res.data);
                    if (res.data && Array.isArray(res.data.data)) {
                        setAvailableDistricts(res.data.data);
                    } else {
                        console.error("BDAPI /district endpoint did not return expected data.data array for division ID", selectedDivision.id, ":", res.data);
                        setAvailableDistricts([]);
                    }
                } catch (err) {
                    console.error("Error fetching districts from BDAPI:", err);
                }
            };
            fetchDistricts();
        } else {
            setAvailableDistricts([]);
        }
    }, [searchParams.division, availableDivisions]);

    // --- Effect: Fetch wards (upazilas) when district changes in searchParams ---
    useEffect(() => {
        // Clear dependent dropdowns if district is unselected or no districts are available yet
        if (!searchParams.district || availableDistricts.length === 0) {
            setAvailableWards([]);
            setAvailableAreas([]);
            return;
        }

        // Find the ID of the selected district name
        const selectedDistrict = availableDistricts.find(dist => dist.name === searchParams.district);
        console.log("Selected district for ward fetch:", searchParams.district, "found ID:", selectedDistrict?.id);


        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    console.log(`Fetching wards (upazilas) for district ID: ${selectedDistrict.id}...`);
                    const res = await axios.get(`${BDAPI_BASE_URL}/upazilla/${selectedDistrict.id}`);
                    console.log("BDAPI /upazilla full response:", res.data); // Log full response
                    if (res.data && Array.isArray(res.data.data)) {
                        setAvailableWards(res.data.data);
                    } else {
                        console.error("BDAPI /upazilla endpoint did not return expected data.data array for district ID", selectedDistrict.id, ":", res.data);
                        setAvailableWards([]);
                    }
                } catch (err) {
                    console.error("Error fetching upazilas (wards) from BDAPI:", err);
                }
            };
            fetchWards();
        } else {
            setAvailableWards([]);
        }
    }, [searchParams.district, availableDistricts]);

    // --- Effect: Fetch areas (unions) when ward (upazila) changes in searchParams ---
    useEffect(() => {
        // Clear dependent dropdowns if ward is unselected or no wards are available yet
        if (!searchParams.ward || availableWards.length === 0) {
            setAvailableAreas([]);
            return;
        }

        // Find the ID of the selected ward (upazila) name
        const selectedWard = availableWards.find(w => w.name === searchParams.ward);
        console.log("Selected ward for area fetch:", searchParams.ward, "found ID:", selectedWard?.id);


        if (selectedWard) {
            const fetchAreas = async () => {
                try {
                    console.log(`Fetching areas (unions) for ward ID: ${selectedWard.id}...`);
                    const res = await axios.get(`${BDAPI_BASE_URL}/unions/${selectedWard.id}`);
                    console.log("BDAPI /unions full response:", res.data);
                    if (res.data && Array.isArray(res.data.data)) {
                        setAvailableAreas(res.data.data);
                    } else {
                        console.error("BDAPI /unions endpoint did not return expected data.data array for upazila ID", selectedWard.id, ":", res.data);
                        setAvailableAreas([]);
                    }
                } catch (err) {
                    console.error("Error fetching unions (areas) from BDAPI:", err);
                }
            };
            fetchAreas();
        } else {
            setAvailableAreas([]);
        }
    }, [searchParams.ward, availableWards]);

    // --- Handler: Apply price filter when inputs lose focus ---
    const handlePriceApply = () => {
        const parsedMin = parseFloat(minPriceInput);
        const parsedMax = parseFloat(maxPriceInput);

        onFilterChange('minPrice', isNaN(parsedMin) ? 0 : parsedMin);
        onFilterChange('maxPrice', isNaN(parsedMax) ? 10000000 : parsedMax);
    };

    const usageOptions = [
        { label: 'Any', value: null },
        { label: 'New', value: 'new' },
        { label: 'Used - Less than 1 year', value: 'less_than_1_year' },
        { label: 'Used - 1 to 3 years', value: '1_3_years' },
        { label: 'Used - 3 to 5 years', value: '3_5_years' },
        { label: 'Used - More than 5 years', value: 'more_than_5_years' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-300 flex items-center gap-2 mb-6">
                <SlidersHorizontal size={20} /> Filters
            </h3>

            {/* Category Filter */}
            <div className="border-b border-slate-700 pb-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                    <h4 className="font-medium text-lg">Category</h4>
                    {isCategoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {isCategoryOpen && (
                    <select
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 mt-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={searchParams.category || ''} // Handle null for 'All Categories'
                        onChange={(e) => onFilterChange('category', e.target.value === '' ? null : e.target.value)}
                    >
                        <option value="">All Categories</option>
                        { }
                        {(Array.isArray(availableCategories) ? availableCategories : []).map(cat => (
                            <option key={cat.category_id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-slate-700 pb-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                    <h4 className="font-medium text-lg">Price Range (৳)</h4>
                    {isPriceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {isPriceOpen && (
                    <div className="flex gap-2 mt-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            onBlur={handlePriceApply} // Apply when input loses focus
                            onKeyPress={(e) => { if (e.key === 'Enter') handlePriceApply(); }} // Also apply on Enter key
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            onBlur={handlePriceApply} // Apply when input loses focus
                            onKeyPress={(e) => { if (e.key === 'Enter') handlePriceApply(); }} // Also apply on Enter key
                        />
                    </div>
                )}
            </div>

            {/* Usage Duration Filter */}
            <div className="border-b border-slate-700 pb-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsUsageOpen(!isUsageOpen)}>
                    <h4 className="font-medium text-lg">Used For</h4>
                    {isUsageOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {isUsageOpen && (
                    <select
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 mt-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={searchParams.usedFor || ''} // Handle null for 'Any'
                        onChange={(e) => onFilterChange('usedFor', e.target.value === '' ? null : e.target.value)}
                    >
                        {usageOptions.map(option => (
                            <option key={option.value || 'any'} value={option.value || ''}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Address Filters (Cascading Dropdowns) */}
            <div className="pb-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsAddressOpen(!isAddressOpen)}>
                    <h4 className="font-medium text-lg">Location</h4>
                    {isAddressOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {isAddressOpen && (
                    <div className="space-y-3 mt-2">
                        {/* Division Dropdown */}
                        <select
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={searchParams.division || ''}
                            onChange={(e) => onFilterChange('division', e.target.value === '' ? null : e.target.value)}
                        >
                            <option value="">Select Division</option>
                            {/* console.log availableDivisions right before map */}
                            {console.log("Rendering Divisions (from state):", availableDivisions)}
                            {(Array.isArray(availableDivisions) ? availableDivisions : []).map(div => (
                                <option key={div.id} value={div.name}> {/* Use name as value to send to backend */}
                                    {div.name}
                                </option>
                            ))}
                        </select>

                        {/* District Dropdown (disabled until division selected) */}
                        <select
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={searchParams.district || ''}
                            onChange={(e) => onFilterChange('district', e.target.value === '' ? null : e.target.value)}
                            disabled={!searchParams.division || !Array.isArray(availableDistricts) || availableDistricts.length === 0}
                        >
                            <option value="">Select District</option>
                            {console.log("Rendering Districts (from state):", availableDistricts)}
                            {(Array.isArray(availableDistricts) ? availableDistricts : []).map(dist => (
                                <option key={dist.id} value={dist.name}> {/* Use name as value to send to backend */}
                                    {dist.name}
                                </option>
                            ))}
                        </select>

                        {/* Ward (Upazila) Dropdown (disabled until district selected) */}
                        <select
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={searchParams.ward || ''}
                            onChange={(e) => onFilterChange('ward', e.target.value === '' ? null : e.target.value)}
                            disabled={!searchParams.district || !Array.isArray(availableWards) || availableWards.length === 0}
                        >
                            <option value="">Select Ward (Upazila)</option>
                            {console.log("Rendering Wards (from state):", availableWards)}
                            {(Array.isArray(availableWards) ? availableWards : []).map(w => (
                                <option key={w.id} value={w.name}> {/* Use name as value to send to backend */}
                                    {w.name}
                                </option>
                            ))}
                        </select>

                        {/* Area (Union) Dropdown (disabled until ward selected) */}
                        <select
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={searchParams.area || ''}
                            onChange={(e) => onFilterChange('area', e.target.value === '' ? null : e.target.value)}
                            disabled={!searchParams.ward || !Array.isArray(availableAreas) || availableAreas.length === 0}
                        >
                            <option value="">Select Area (Union)</option>
                            {console.log("Rendering Areas (from state):", availableAreas)}
                            {(Array.isArray(availableAreas) ? availableAreas : []).map(a => (
                                <option key={a.id} value={a.name}> {/* Use name as value to send to backend */}
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;
