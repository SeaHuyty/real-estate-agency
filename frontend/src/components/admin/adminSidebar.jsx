// frontend/src/components/NavBarDashBoard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BookCheck, Settings } from 'lucide-react';

const Sidebar =() => {
    return (
        <aside className="w-64 h-screen bg-blue-950 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-blue-900">
                <Link to="/dashboard">KhodKquiz</Link>
            </div>
            <nav className="flex flex-col p-4">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    to="/leaderboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BarChart3 size={20} />
                    <span>Leaderboard</span>
                </Link>
                <Link
                    to="/quiz"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BookCheck size={20} />
                    <span>My Quizzes</span>
                </Link>
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 mt-auto rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>
        </aside>
    );
}
export default Sidebar;