import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../App";
import {
    User,
    Mail,
    Calendar,
    Edit2,
    Save,
    X,
    LogOut,
    Home,
} from "lucide-react";

interface Props {
    userData: UserData;
    updateUserData: (updates: Partial<UserData>) => void;
    onLogout: () => void;
}

export default function ProfilePage({ userData, updateUserData, onLogout }: Props) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(userData.name || "");
    const [loading, setLoading] = useState(true);

    // Debug: Log userData when component mounts
    useEffect(() => {
        console.log("ProfilePage - userData:", userData);
        console.log("ProfilePage - name:", userData.name);
        console.log("ProfilePage - email:", userData.email);
        console.log("ProfilePage - picture:", userData.picture);
    }, [userData]);

    // Fetch user data from database
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem("userEmail") || userData.email;

                if (!email) {
                    console.log("❌ No email found");
                    setLoading(false);
                    return;
                }

                console.log("📥 Fetching user data for:", email);

                const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly.vercel.app";
                const response = await fetch(`${apiUrl}/api/user/${encodeURIComponent(email)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const dbUserData = await response.json();
                console.log("✅ User data from database:", dbUserData);

                // Update userData with fresh data from database
                updateUserData({
                    name: dbUserData.name,
                    email: dbUserData.email,
                    picture: dbUserData.picture,
                    niche: dbUserData.niche,
                    shopifyConnected: dbUserData.shopifyConnected,
                    adminUrl: dbUserData.adminUrl,
                });

                setEditedName(dbUserData.name || "");

            } catch (error) {
                console.error("❌ Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = () => {
        updateUserData({ name: editedName });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(userData.name || "");
        setIsEditing(false);
    };

    const handleLogout = () => {
        onLogout();
    };

    const profileSections = [
        {
            title: "Personal Information",
            items: [
                { label: "Full Name", value: userData.name || "Not set", icon: User },
                { label: "Email Address", value: userData.email || "Not set", icon: Mail },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Actions */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Profile</h1>
                        <p className="text-lg text-slate-600">Manage your account information</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-[#3B985D] transition-all shadow-sm"
                        >
                            <Home className="w-4 h-4" />
                            <span className="font-medium">Home</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-[#3B985D] via-emerald-600 to-emerald-700"></div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex items-end -mt-16 mb-6">
                            <div className="relative">
                                {userData.picture ? (
                                    <img
                                        src={userData.picture}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                                        onError={(e) => {
                                            console.error("Failed to load profile image");
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-[#3B985D] to-emerald-700 flex items-center justify-center">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-6 mb-2">
                                {isEditing ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="text-2xl font-bold text-slate-900 border-b-2 border-[#3B985D] focus:outline-none bg-transparent"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSave}
                                            className="p-2 bg-[#3B985D] text-white rounded-lg hover:bg-[#2F7A4B] transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <h2 className="text-2xl font-bold text-slate-900">{userData.name || "User"}</h2>
                                        {/* <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-slate-600" />
                                        </button> */}
                                    </div>
                                )}
                                <p className="text-slate-600 mt-1">{userData.email || "No email"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="space-y-6">
                    {profileSections.map((section, sectionIndex) => (
                        <div
                            key={sectionIndex}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6">{section.title}</h3>
                            <div className="space-y-4">
                                {section.items.map((item, itemIndex) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={itemIndex}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-[#3B985D]/10 rounded-lg">
                                                    <Icon className="w-5 h-5 text-[#3B985D]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">{item.label}</p>
                                                    <p className="text-base font-semibold text-slate-900">{item.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Account Created */}
                <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center space-x-3 text-slate-600">
                        <Calendar className="w-5 h-5" />
                        <p className="text-sm">
                            Account created: {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
