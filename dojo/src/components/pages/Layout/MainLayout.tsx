import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from '../../organisms/Navbar/Navbar';
import { Footer } from '../../organisms/Footer/Footer';
import { NavigationRail } from './NavigationRail';
import { ExpandableSidePanel } from './ExpandableSidePanel';
import { API_ENDPOINTS } from "../../constants/api";
import { NAVIGATION_ROUTES } from "../../constants/navigation";
import { logout, clearAuth } from "../../hooks/useAuth";
import { type TabId } from "../../constants/tileData";
import type { RootState, AppDispatch } from "../../../store/store";
import NL_Logo from '../../../assets/Images/nl_technologies_logo.png';

const localhostout = () => {
    const [companyLogo, setCompanyLogo] = useState<{ logo: string } | null>(null);
    const [logoLoading, setLogoLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await dispatch(logout());
        dispatch(clearAuth());
        navigate("/");
    }, [dispatch, navigate]);

    const handleTabSelect = (tabId: TabId) => {
        if (activeTab === tabId) {
            setIsPanelOpen(!isPanelOpen);
        } else {
            setActiveTab(tabId);
            setIsPanelOpen(true);
        }
    };
    

    const fetchNotifications = useCallback(async () => {
        const authData = localStorage.getItem("auth");
        const token = authData ? JSON.parse(authData).accessToken : "";
        if (!token) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/lms/notifications/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.status === 401) { handleLogout(); return; }
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.is_read).length);
            }
        } catch (err) { console.error("Notification Error:", err); }
    }, [handleLogout]);// Included handleLogout in dependencies

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchCompanyLogo = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGOS}`);
                const data = await response.json();
                if (data?.logo_url) setCompanyLogo({ logo: data.logo_url });
            } catch (error) { console.error("Logo Error:", error); }
            finally { setLogoLoading(false); }
        };

        fetchCompanyLogo();
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
        // Removed fetchNotifications from here to prevent the loop if it changes
    }, [isAuthenticated]);

    

    return (
        <div className="flex h-screen w-full bg-surface text-text antialiased overflow-hidden transition-colors duration-300">

            {/* 1. LEFT ICON DOCK (Navigation Rail) */}
            <NavigationRail
                activeTab={activeTab}
                onTabSelect={handleTabSelect}
            />

            {/* 2. FLEX ROW FOR SIDEBAR AND CONTENT */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* SIDEBAR PANEL */}
                <ExpandableSidePanel
                    activeTab={activeTab}
                    isOpen={isPanelOpen}
                    onClose={() => setIsPanelOpen(false)}
                    userRole={user?.role || 'employee'}
                />

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 flex flex-col min-w-0 bg-surface">

                    <Navbar
                        user={user}
                        unreadCount={unreadCount}
                        notifications={notifications}
                        refreshNotifications={fetchNotifications}
                        onLogout={handleLogout}
                        onPrivacyPolicy={() => navigate(NAVIGATION_ROUTES.PRIVACY_POLICY)}
                        onTermsAndConditions={() => navigate(NAVIGATION_ROUTES.TERMS_AND_CONDITIONS)}
                        onVersionControl={() => navigate(NAVIGATION_ROUTES.VERSION_CONTROL)}
                    />

                    {/* UPDATED MAIN SECTION: 
                       1. Added 'flex flex-col' so children stack vertically.
                       2. Moved Footer inside here so it scrolls with content.
                    */}
                    <main className="flex-1 overflow-y-auto pt-1 bg-surface flex flex-col">

                        {/* UPDATED CONTENT WRAPPER:
                           Changed 'h-full' to 'flex-1'. 
                           This allows the content to take up available space but pushes the footer down naturally.
                        */}
                        <div className="w-full flex-1">
                            <Outlet context={{ refreshNotifications: fetchNotifications, activeTab }} />
                        </div>

                        {/* Footer is now part of the scrollable flow */}
                        <Footer
                            isLoading={logoLoading}
                            logoUrl={companyLogo?.logo || NL_Logo}
                            companyName="NL Technologies Pvt.Ltd"
                            companyUrl="http://nltecsolutions.com/"
                            tagline="Empowering Industrial Excellence Through Digital Transformation"
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default localhostout;