import { useNavigate } from "react-router-dom";
import { UserData } from "../App";
import {
    Store,
    Package,
    TrendingUp,
    Settings,
    BarChart3,
    ShoppingCart,
    ArrowRight,
    CheckCircle2,
    Clock,
} from "lucide-react";

interface Props {
    userData: UserData;
}

export default function HomePage({ userData }: Props) {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: "View Progress",
            description: "Continue your store setup",
            icon: Clock,
            path: "/progress",
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Add Products",
            description: "Add top-selling products",
            icon: Package,
            path: "/AddProductsPage",
            color: "from-emerald-500 to-emerald-600",
        },
        {
            title: "Customize Store",
            description: "Make your store unique",
            icon: Settings,
            path: "/customize",
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Grow Business",
            description: "Marketing & analytics",
            icon: TrendingUp,
            path: "/grow",
            color: "from-orange-500 to-orange-600",
        },
    ];

    const stats = [
        { label: "Store Status", value: userData.shopifyConnected ? "Connected" : "Not Connected", icon: Store },
        { label: "Selected Niche", value: userData.niche || "Not Selected", icon: ShoppingCart },
        { label: "Theme", value: userData.selectedTheme || "Not Selected", icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Welcome back, {userData.name || "there"}
                    </h1>
                    <p className="text-lg text-slate-600">
                        Manage your Shopify store and grow your business
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className="p-3 bg-slate-100 rounded-xl">
                                        <Icon className="w-6 h-6 text-slate-700" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all text-left"
                                >
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-700">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                                    <div className="flex items-center text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                        <span>Get started</span>
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Setup Status */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Setup Status</h2>
                    <div className="space-y-4">
                        <StatusItem
                            label="Niche Selected"
                            completed={!!userData.niche}
                            action={() => navigate("/niche")}
                        />
                        <StatusItem
                            label="Banners Chosen"
                            completed={userData.selectedBanners.length > 0}
                            action={() => navigate("/banners")}
                        />
                        <StatusItem
                            label="Shopify Connected"
                            completed={userData.shopifyConnected}
                            action={() => navigate("/connect-shopify")}
                        />
                        <StatusItem
                            label="Theme Selected"
                            completed={!!userData.selectedTheme}
                            action={() => navigate("/themes")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusItem({
    label,
    completed,
    action,
}: {
    label: string;
    completed: boolean;
    action: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
                {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
                <span className={`font-medium ${completed ? "text-slate-900" : "text-slate-600"}`}>
                    {label}
                </span>
            </div>
            {!completed && (
                <button
                    onClick={action}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Complete
                </button>
            )}
        </div>
    );
}
