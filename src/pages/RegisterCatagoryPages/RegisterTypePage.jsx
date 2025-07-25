import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaTruckMoving, FaArrowLeft } from 'react-icons/fa';

const RegisterTypePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold mb-10 text-center">Choose Registration Type</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* User Card */}
                <div
                    onClick={() => navigate('/register/user')}
                    className="cursor-pointer group bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/50 hover:border-blue-400 transform hover:-translate-y-1 transition duration-300"
                >
                    <div className="flex flex-col items-center justify-center gap-4">
                        <FaUserAlt size={40} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold">Register as User</h2>
                        <p className="text-sm text-gray-400 text-center">
                            For buyers and sellers looking to use AfterMart.
                        </p>
                    </div>
                </div>

                {/* Delivery Service Card */}
                <div
                    onClick={() => navigate('/register/deliveryservice')}
                    className="cursor-pointer group bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-green-500/50 hover:border-green-400 transform hover:-translate-y-1 transition duration-300"
                >
                    <div className="flex flex-col items-center justify-center gap-4">
                        <FaTruckMoving size={40} className="text-green-400 group-hover:scale-110 transition-transform" />
                        <h2 className="text-xl font-semibold">Register as Delivery Service</h2>
                        <p className="text-sm text-gray-400 text-center">
                            For logistics companies offering delivery support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-12">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
                >
                    <FaArrowLeft />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default RegisterTypePage;