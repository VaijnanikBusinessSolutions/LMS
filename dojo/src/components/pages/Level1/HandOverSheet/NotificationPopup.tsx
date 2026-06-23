// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom"; 
// import type { RootState } from "../store/store"; // Ensure this path matches your project

// const NotificationPopup: React.FC = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [notificationCount, setNotificationCount] = useState(0);
//     const [currentUserId, setCurrentUserId] = useState<string>(""); 
    
//     const accessToken = useSelector((state: RootState) => state.auth.accessToken);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!accessToken) return;

//         const checkNotifications = async () => {
//             try {
//                 // 1. Get User Info to find out "My ID"
//                 const userRes = await fetch("http://127.0.0.1:8000/users/me/", {
//                     headers: { "Authorization": `Bearer ${accessToken}` }
//                 });
                
//                 if (userRes.ok) {
//                     const userData = await userRes.json();
//                     // Store the ID (e.g., "15") so we can use it for filtering later
//                     setCurrentUserId(String(userData.id)); 
//                 }

//                 // 2. Check for Unread Notifications
//                 const notifRes = await fetch("http://127.0.0.1:8000/notifications/unread/", {
//                     headers: { "Authorization": `Bearer ${accessToken}` }
//                 });
                
//                 if (notifRes.ok) {
//                     const notifData = await notifRes.json();
//                     if (notifData.count > 0) {
//                         setNotificationCount(notifData.count);
//                         setShowModal(true);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch notifications", error);
//             }
//         };

//         checkNotifications();
//     }, [accessToken]);

//     const handleMarkAsRead = async () => {
//         try {
//             await fetch("http://127.0.0.1:8000/notifications/mark-read/", {
//                 method: "POST",
//                 headers: { "Authorization": `Bearer ${accessToken}` }
//             });
//             setShowModal(false);
//         } catch (error) {
//             console.error("Error clearing notifications", error);
//         }
//     };

//     const handleView = async () => {
//         // 1. Mark as read in backend
//         await handleMarkAsRead();
        
//         // 2. Redirect to Dashboard with the ID filter
//         navigate(`/supervisordashboard?supervisor_id=${currentUserId}`);
//     };

//     if (!showModal) return null;

//     // --- Inline Styles ---
//     const styles = {
//         overlay: {
//             position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             display: 'flex', justifyContent: 'center', alignItems: 'center',
//             zIndex: 9999
//         },
//         content: {
//             backgroundColor: 'white', padding: '30px', borderRadius: '15px',
//             width: '400px', textAlign: 'center' as const,
//             boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
//         },
//         title: { fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' },
//         message: { fontSize: '18px', color: '#4b5563', marginBottom: '25px' },
//         buttonGroup: { display: 'flex', gap: '15px', justifyContent: 'center' },
//         btnView: {
//             padding: '10px 25px', backgroundColor: '#2563eb', color: 'white',
//             border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
//         },
//         btnOk: {
//             padding: '10px 25px', backgroundColor: '#e5e7eb', color: '#374151',
//             border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
//         }
//     };

//     return (
//         <div style={styles.overlay}>
//             <div style={styles.content}>
//                 <div style={{fontSize: '40px', marginBottom: '10px'}}>🔔</div>
//                 <h2 style={styles.title}>New Assignments!</h2>
//                 <p style={styles.message}>
//                     <b>{notificationCount}</b> employees have been assigned under you.
//                 </p>
//                 <div style={styles.buttonGroup}>
//                     <button style={styles.btnView} onClick={handleView}>View</button>
//                     <button style={styles.btnOk} onClick={handleMarkAsRead}>OK</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotificationPopup;




import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../../store/store"; // Adjust the path as necessary

const NotificationPopup: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [isClosing, setIsClosing] = useState(false);

    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) return;

        const checkNotifications = async () => {
            try {
                const userRes = await fetch("http://127.0.0.1:8000/users/me/", {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setCurrentUserId(String(userData.id));
                }

                const notifRes = await fetch("http://127.0.0.1:8000/notifications/unread/", {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    if (notifData.count > 0) {
                        setNotificationCount(notifData.count);
                        setShowModal(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        checkNotifications();
    }, [accessToken]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 300);
    };

    const handleMarkAsRead = async () => {
        try {
            await fetch("http://127.0.0.1:8000/notifications/mark-read/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
            handleClose();
        } catch (error) {
            console.error("Error clearing notifications", error);
        }
    };

    const handleView = async () => {
        await fetch("http://127.0.0.1:8000/notifications/mark-read/", {
            method: "POST",
            headers: { "Authorization": `Bearer ${accessToken}` }
        }).catch(console.error);
        
        handleClose();
        setTimeout(() => {
            navigate(`/supervisordashboard?supervisor_id=${currentUserId}`);
        }, 300);
    };

    if (!showModal) return null;

    return (
        <>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    
                    @keyframes slideDown {
                        from { 
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                        to { 
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    
                    @keyframes ring {
                        0% { transform: rotate(0deg); }
                        10% { transform: rotate(15deg); }
                        20% { transform: rotate(-15deg); }
                        30% { transform: rotate(10deg); }
                        40% { transform: rotate(-10deg); }
                        50% { transform: rotate(5deg); }
                        60% { transform: rotate(-5deg); }
                        70% { transform: rotate(0deg); }
                        100% { transform: rotate(0deg); }
                    }
                    
                    @keyframes shimmer {
                        0% { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    
                    .notification-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(59, 130, 246, 0.3) 100%);
                        backdrop-filter: blur(8px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        animation: ${isClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease-out forwards;
                    }
                    
                    .notification-card {
                        background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
                        padding: 0;
                        border-radius: 24px;
                        width: 420px;
                        max-width: 90vw;
                        box-shadow: 
                            0 25px 50px -12px rgba(99, 102, 241, 0.4),
                            0 0 0 1px rgba(139, 92, 246, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.8);
                        animation: ${isClosing ? 'slideDown' : 'slideUp'} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        overflow: hidden;
                        position: relative;
                    }
                    
                    .notification-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6, #6366f1);
                        background-size: 200% 100%;
                        animation: gradientShift 3s ease infinite;
                    }
                    
                    .notification-header {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%);
                        padding: 30px 30px 40px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .notification-header::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .notification-header::after {
                        content: '';
                        position: absolute;
                        bottom: -20px;
                        left: 0;
                        right: 0;
                        height: 40px;
                        background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
                        border-radius: 50% 50% 0 0;
                    }
                    
                    .bell-container {
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 15px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        backdrop-filter: blur(10px);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        animation: pulse 2s ease-in-out infinite;
                    }
                    
                    .bell-icon {
                        font-size: 40px;
                        animation: ring 2s ease-in-out infinite;
                        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
                    }
                    
                    .notification-badge {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
                        color: white;
                        font-size: 14px;
                        font-weight: bold;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 3px solid white;
                        box-shadow: 0 4px 12px rgba(244, 63, 94, 0.5);
                        animation: pulse 1.5s ease-in-out infinite;
                    }
                    
                    .notification-title {
                        font-size: 26px;
                        font-weight: 800;
                        color: white;
                        margin: 0;
                        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        position: relative;
                        z-index: 1;
                    }
                    
                    .notification-body {
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .notification-message {
                        font-size: 18px;
                        color: #4b5563;
                        margin: 0 0 10px;
                        line-height: 1.6;
                    }
                    
                    .highlight-count {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        font-size: 24px;
                        font-weight: 800;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        margin: 15px 0;
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
                        animation: pulse 2s ease-in-out infinite;
                    }
                    
                    .sub-message {
                        font-size: 15px;
                        color: #6b7280;
                        margin: 0 0 25px;
                    }
                    
                    .button-group {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                    }
                    
                    .btn {
                        padding: 14px 32px;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .btn-view {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
                        background-size: 200% 200%;
                        color: white;
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
                    }
                    
                    .btn-view:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 12px 28px rgba(99, 102, 241, 0.5);
                        background-position: 100% 100%;
                    }
                    
                    .btn-view:active {
                        transform: translateY(-1px);
                    }
                    
                    .btn-view::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                        animation: shimmer 2s infinite;
                    }
                    
                    .btn-dismiss {
                        background: linear-gradient(145deg, #f3f4f6 0%, #e5e7eb 100%);
                        color: #6366f1;
                        border: 2px solid transparent;
                    }
                    
                    .btn-dismiss:hover {
                        transform: translateY(-3px);
                        background: linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%);
                        border-color: #c7d2fe;
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
                    }
                    
                    .btn-dismiss:active {
                        transform: translateY(-1px);
                    }
                    
                    .sparkle {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: white;
                        border-radius: 50%;
                        opacity: 0.6;
                    }
                    
                    .sparkle-1 { top: 20%; left: 10%; animation: float 3s ease-in-out infinite; }
                    .sparkle-2 { top: 60%; left: 85%; animation: float 4s ease-in-out infinite 1s; }
                    .sparkle-3 { top: 30%; left: 75%; animation: float 3.5s ease-in-out infinite 0.5s; }
                `}
            </style>
            
            <div className="notification-overlay">
                <div className="notification-card">
                    <div className="notification-header">
                        <div className="sparkle sparkle-1"></div>
                        <div className="sparkle sparkle-2"></div>
                        <div className="sparkle sparkle-3"></div>
                        
                        <div className="bell-container">
                            <span className="bell-icon">🔔</span>
                            <div className="notification-badge">{notificationCount}</div>
                        </div>
                        <h2 className="notification-title">New Assignments!</h2>
                    </div>
                    
                    <div className="notification-body">
                        <p className="notification-message">
                            You have new team members waiting!
                        </p>
                        <div className="highlight-count">{notificationCount}</div>
                        <p className="sub-message">
                            employee{notificationCount > 1 ? 's have' : ' has'} been assigned under your supervision
                        </p>
                        
                        <div className="button-group">
                            <button className="btn btn-view" onClick={handleView}>
                                👀 View Dashboard
                            </button>
                            <button className="btn btn-dismiss" onClick={handleMarkAsRead}>
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationPopup;