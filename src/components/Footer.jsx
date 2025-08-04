import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import { ShoppingBag, Users, Handshake } from 'lucide-react';
const PORT = 5000;
const Footer = () => {
    const [stats, setStats] = useState({
        total_products: 0,
        total_deals: 0,
        total_users: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stats/summary`);
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <footer className="bg-slate-900 text-white py-10 mt-10">
            <div className="container mx-auto px-4 text-center">

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                    <StatBox
                        icon={ShoppingBag}
                        label="Total Products"
                        end={stats.total_products}
                        iconColor="text-blue-400"
                    />
                    <StatBox
                        icon={Handshake}
                        label="Deals Completed"
                        end={stats.total_deals}
                        iconColor="text-green-400"
                    />
                    <StatBox
                        icon={Users}
                        label="Active Users"
                        end={stats.total_users}
                        iconColor="text-purple-400"
                    />
                </div>

                <div className="flex justify-center gap-6 text-sm text-gray-300 mb-4">
                    <a href="/about" className="hover:text-blue-400 transition">About Us</a>
                    <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
                    <a href="/terms" className="hover:text-blue-400 transition">Terms of Service</a>
                </div>

                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} <span className="text-blue-300 font-medium">AfterMart</span>. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

const StatBox = ({ icon: Icon, label, end, iconColor }) => {
    return (
        <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <Icon className={`w-8 h-8 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-blue-300 animate-after-count">
                <CountUp
                    end={end}
                    duration={2.5}
                    useEasing={true}
                    separator=","
                    onEnd={() => {
                        const el = document.getElementById(label);
                        el?.classList.add('animate-pulse');
                    }}
                >
                    {({ countUpRef }) => (
                        <span ref={countUpRef} id={label}></span>
                    )}
                </CountUp>
            </p>
            <p className="text-sm mt-1 text-gray-300 group-hover:text-white transition-colors duration-300">{label}</p>
        </div>
    );
};

export default Footer;
