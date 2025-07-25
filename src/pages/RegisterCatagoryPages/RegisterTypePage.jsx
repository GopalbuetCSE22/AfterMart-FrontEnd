import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTypePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">Choose Registration Type</h1>
            <div className="flex gap-8">
                <button
                    onClick={() => navigate('/register/user')}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg font-semibold transition"
                >
                    Register as User
                </button>
                <button
                    onClick={() => navigate('/register/deliveryservice')}
                    className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold transition"
                >
                    Register as Delivery Service
                </button>
            </div>
        </div>
    );
};

export default RegisterTypePage;
