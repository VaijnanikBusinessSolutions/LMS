



// import { Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";

// // --- MASTER DESIGN & THEME CONTEXT ---
// import { useDesign } from "../../../context/DesignContext";
// import { useTheme } from "../../../theme/ThemeContext";

// // --- DUAL COMPONENT IMPORTS ---
// import { Navbar } from '../../organisms/Navbar/Navbar';
// import { NavigationRail } from '../../pages/Layout/NavigationRail';
// import { ExpandableSidePanel } from '../../pages/Layout/ExpandableSidePanel';

// import { NavbarNew } from "../../organisms/Navbar copy/Navbar";
// import { NavigationRailNew } from '../../pages/Layout copy/NavigationRail';
// import { ExpandableSidePanelNew } from '../../pages/Layout copy/ExpandableSidePanel';

// import { Footer } from '../../organisms/Footer/Footer';
// import { API_ENDPOINTS } from "../../constants/api";
// import { NAVIGATION_ROUTES } from "../../constants/navigation";
// import { logout, clearAuth } from "../../hooks/useAuth";
// import { type TabId } from "../../constants/tileData";
// import type { RootState, AppDispatch } from "../../../store/store";
// import NL_Logo from '../../../assets/Images/nl_technologies_logo.png';

// const MainLayout = () => {
//     const { designMode } = useDesign();
//     const { theme } = useTheme();

//     const [companyLogo, setCompanyLogo] = useState<{ logo: string } | null>(null);
//     const [logoLoading, setLogoLoading] = useState(true);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);

//     const [activeTab, setActiveTab] = useState<TabId>('overview');
//     const [isPanelOpen, setIsPanelOpen] = useState(true);

//     const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const handleLogout = useCallback(async () => {
//         await dispatch(logout());
//         dispatch(clearAuth());
//         navigate("/");
//     }, [dispatch, navigate]);

//     const fetchNotifications = useCallback(async () => {
//         const authData = localStorage.getItem("auth");
//         const token = authData ? JSON.parse(authData).accessToken : "";
//         if (!token) return;

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/lms/notifications/`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//             if (response.status === 401) { handleLogout(); return; }
//             if (response.ok) {
//                 const data = await response.json();
//                 setNotifications(data);
//                 setUnreadCount(data.filter((n: any) => !n.is_read).length);
//             }
//         } catch (err) { console.error("Notification Error:", err); }
//     }, [handleLogout]);

//     useEffect(() => {
//         if (!isAuthenticated) return;
//         const fetchCompanyLogo = async () => {
//             try {
//                 const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGOS}`);
//                 const data = await response.json();
//                 if (data?.logo_url) setCompanyLogo({ logo: data.logo_url });
//             } catch (error) { console.error("Logo Error:", error); }
//             finally { setLogoLoading(false); }
//         };
//         fetchCompanyLogo();
//         fetchNotifications();
//         const interval = setInterval(fetchNotifications, 60000);
//         return () => clearInterval(interval);
//     }, [isAuthenticated, fetchNotifications]);

//     const handleTabSelect = (tabId: TabId) => {
//         if (activeTab === tabId) {
//             setIsPanelOpen(!isPanelOpen);
//         } else {
//             setActiveTab(tabId);
//             setIsPanelOpen(true);
//         }
//     };

//     return (
//         /* OUTER WRAPPER: Handles the 'dark' class and the main background */

//     /* OUTER WRAPPER */
//     <div className={`flex h-screen w-full transition-all duration-500 
//         /* FIX: Remove the 'designMode === modern' check from here 
//            so the Sun/Moon icon actually works in both designs! */
//         ${theme === 'dark' ? 'dark' : ''} 

//         /* DYNAMIC BACKGROUND LOGIC */
//         ${designMode === 'modern' 
//             ? (theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f0f9ff]') // Deep Midnight vs Soft Sky Blue
//             : (theme === 'dark' ? 'bg-[#1e293b]' : 'bg-[#f8fafc]') // Slate Dark vs Cloud White
//         }
//     `}>

//             {/* 1. DYNAMIC NAVIGATION RAIL */}
//             {designMode === 'modern' ? (
//                 <NavigationRailNew activeTab={activeTab} onTabSelect={handleTabSelect} />
//             ) : (
//                 <NavigationRail activeTab={activeTab} onTabSelect={handleTabSelect} />
//             )}

//             <div className="flex-1 flex overflow-hidden relative">

//                 {/* 2. DYNAMIC SIDEBAR PANEL */}
//                 {designMode === 'modern' ? (
//                     <ExpandableSidePanelNew
//                         activeTab={activeTab}
//                         isOpen={isPanelOpen}
//                         onClose={() => setIsPanelOpen(false)}
//                         userRole={user?.role || 'employee'}
//                     />
//                 ) : (
//                     <ExpandableSidePanel
//                         activeTab={activeTab}
//                         isOpen={isPanelOpen}
//                         onClose={() => setIsPanelOpen(false)}
//                         userRole={user?.role || 'employee'}
//                     />
//                 )}

//                 {/* MAIN CONTENT AREA: Removed conflicting background classes */}
//                 <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

//                     {/* 3. DYNAMIC NAVBAR */}
//                     {designMode === 'modern' ? (
//                         <NavbarNew
//                             user={user}
//                             unreadCount={unreadCount}
//                             notifications={notifications}
//                             refreshNotifications={fetchNotifications}
//                             onLogout={handleLogout}
//                             onPrivacyPolicy={() => navigate(NAVIGATION_ROUTES.PRIVACY_POLICY)}
//                             onTermsAndConditions={() => navigate(NAVIGATION_ROUTES.TERMS_AND_CONDITIONS)}
//                             onVersionControl={() => navigate(NAVIGATION_ROUTES.VERSION_CONTROL)}
//                         />
//                     ) : (
//                         <Navbar
//                             user={user}
//                             unreadCount={unreadCount}
//                             notifications={notifications}
//                             refreshNotifications={fetchNotifications}
//                             onLogout={handleLogout}
//                             onPrivacyPolicy={() => navigate(NAVIGATION_ROUTES.PRIVACY_POLICY)}
//                             onTermsAndConditions={() => navigate(NAVIGATION_ROUTES.TERMS_AND_CONDITIONS)}
//                             onVersionControl={() => navigate(NAVIGATION_ROUTES.VERSION_CONTROL)}
//                         />
//                     )}

//                     <main className="flex-1 overflow-y-auto pt-1 flex flex-col">
//                         <div className="w-full flex-1">
//                             <Outlet context={{ refreshNotifications: fetchNotifications, activeTab, designMode, theme }} />
//                         </div>

//                         <Footer
//                             isLoading={logoLoading}
//                             logoUrl={companyLogo?.logo || NL_Logo}
//                             companyName="NL Technologies Pvt.Ltd"
//                             companyUrl="http://nltecsolutions.com/"
//                             tagline="Empowering Industrial Excellence Through Digital Transformation"
//                         />
//                     </main>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MainLayout;





import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// --- MASTER DESIGN & THEME CONTEXT ---
import { useDesign } from "../../../context/DesignContext";
import { useTheme } from "../../../theme/ThemeContext";

// --- DUAL COMPONENT IMPORTS ---
import { Navbar } from '../../organisms/Navbar/Navbar';
import { NavigationRail } from '../../pages/Layout/NavigationRail';
import { ExpandableSidePanel } from '../../pages/Layout/ExpandableSidePanel';
import { Footer } from '../../organisms/Footer/Footer'; // Classic Footer

import { NavbarNew } from "../../organisms/Navbar copy/Navbar";
import { NavigationRailNew } from '../../pages/Layout copy/NavigationRail';
import { ExpandableSidePanelNew } from '../../pages/Layout copy/ExpandableSidePanel';


import { API_ENDPOINTS } from "../../constants/api";
import { NAVIGATION_ROUTES } from "../../constants/navigation";
import { logout, clearAuth } from "../../hooks/useAuth";
import { type TabId } from "../../constants/tileData";
import type { RootState, AppDispatch } from "../../../store/store";
import NL_Logo from '../../../assets/Images/nl_technologies_logo.png';
import NL_Logo_White from '../../../assets/Images/nl_white_logo.png';
import { FooterNew } from "../../organisms/Footer copy/FooterNew";

type NotificationItem = {
    id: number;
    is_read: boolean;
    [key: string]: unknown;
};

const normalizeNotifications = (payload: unknown): NotificationItem[] => {
    if (Array.isArray(payload)) return payload as NotificationItem[];
    if (
        payload &&
        typeof payload === "object" &&
        "results" in payload &&
        Array.isArray((payload as { results?: unknown }).results)
    ) {
        return (payload as { results: NotificationItem[] }).results;
    }
    return [];
};

const MainLayout = () => {
    const { designMode } = useDesign();
    const { theme } = useTheme();

    const [companyLogo, setCompanyLogo] = useState<{ logo: string } | null>(null);
    const [logoLoading, setLogoLoading] = useState(true);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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
                const notificationList = normalizeNotifications(data);
                setNotifications(notificationList);
                setUnreadCount(notificationList.filter((n) => !n.is_read).length);
            }
        } catch (err) { console.error("Notification Error:", err); }
    }, [handleLogout]);

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
    }, [isAuthenticated, fetchNotifications]);

    const handleTabSelect = (tabId: TabId) => {
        if (activeTab === tabId) {
            setIsPanelOpen(!isPanelOpen);
        } else {
            setActiveTab(tabId);
            setIsPanelOpen(true);
        }
    };

    // Shared props for both footer versions
    const footerProps = {
        isLoading: logoLoading,
        // Primary logo (usually for light mode)
        logoUrl: companyLogo?.logo || NL_Logo,

        // Secondary logo (specifically for dark mode)
        // If the API doesn't provide a specific dark logo, we use our local white asset
        darkLogoUrl: companyLogo?.logo || NL_Logo_White,

        companyName: "NL Technologies Pvt.Ltd",
        companyUrl: "http://nltecsolutions.com/",
        tagline: "Empowering Industrial Excellence Through Digital Transformation"
    };

    return (
        <div className={`flex h-screen w-full transition-all duration-500 
            ${theme === 'dark' ? 'dark' : ''} 
            ${designMode === 'modern'
                ? (theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f0f9ff]')
                : (theme === 'dark' ? 'bg-[#1e293b]' : 'bg-[#f8fafc]')
            }
        `}>

            {designMode === 'modern' ? (
                <NavigationRailNew activeTab={activeTab} onTabSelect={handleTabSelect} />
            ) : (
                <NavigationRail activeTab={activeTab} onTabSelect={handleTabSelect} />
            )}

            <div className="flex-1 flex overflow-hidden relative">
                {designMode === 'modern' ? (
                    <ExpandableSidePanelNew
                        activeTab={activeTab}
                        isOpen={isPanelOpen}
                        onClose={() => setIsPanelOpen(false)}
                        userRole={user?.role || user?.userType || ''}
                        user={user}
                    />
                ) : (
                    <ExpandableSidePanel
                        activeTab={activeTab}
                        isOpen={isPanelOpen}
                        onClose={() => setIsPanelOpen(false)}
                        userRole={user?.role || user?.userType || ''}
                        user={user}
                    />
                )}

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {designMode === 'modern' ? (
                        <NavbarNew
                            user={user}
                            unreadCount={unreadCount}
                            notifications={notifications}
                            refreshNotifications={fetchNotifications}
                            onLogout={handleLogout}
                            onPrivacyPolicy={() => navigate(NAVIGATION_ROUTES.PRIVACY_POLICY)}
                            onTermsAndConditions={() => navigate(NAVIGATION_ROUTES.TERMS_AND_CONDITIONS)}
                            onVersionControl={() => navigate(NAVIGATION_ROUTES.VERSION_CONTROL)}
                        />
                    ) : (
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
                    )}

                    <main className="flex-1 overflow-y-auto pt-1 flex flex-col">
                        <div className="w-full flex-1">
                            <Outlet context={{ refreshNotifications: fetchNotifications, activeTab, designMode, theme }} />
                        </div>

                        {/* 2. DYNAMIC FOOTER LOGIC */}
                        {designMode === 'modern' ? (
                            <Footer {...footerProps} />
                        ) : (

                            <FooterNew {...footerProps} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
