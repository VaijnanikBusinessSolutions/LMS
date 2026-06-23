import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 👇 Make sure this path is correct for your project structure
import HumanBodyCheckSheet from '../HumanBodyCheckSheet/HumanBodyCheckSheet'; 
import type { UserInfo } from '../../constants/types'; 
import { humanBodyCheckService } from '../../hooks/ServiceApis'; // Import the service



const HumanBodyCheckpointPage: React.FC = () => {
  // 1. Get the ID from the URL
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) {
      setError('No employee ID was provided in the URL.');
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);

        // 2. Fetch ALL temp users using your service
        // (We do this because we know this API endpoint works: /temp-user-info/)
        const allUsers = await humanBodyCheckService.fetchTempUsers();
        
        console.log(`Scanning ${allUsers.length} users for ID: ${employeeId}`);

        // 3. Find the specific user matching the ID from the URL
        // We check both tempId and temp_id just to be safe
        const foundUser = allUsers.find((u: any) => 
            u.tempId === employeeId || u.temp_id === employeeId
        );

        if (foundUser) {
            console.log("✅ User Found:", foundUser);
            setUserDetails(foundUser);
        } else {
            console.error("❌ User not found in list. Available IDs:", allUsers.map((u:any) => u.tempId));
            throw new Error(`User with ID ${employeeId} not found.`);
        }

      } catch (err) {
        setError('Failed to load employee details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [employeeId]);

  const handleAssessmentComplete = () => {
    navigate('/PassedUsersTable'); 
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-lg font-semibold text-blue-600 animate-pulse">
                Loading Profile for {employeeId}...
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded-xl shadow-lg border border-red-100 text-center">
                <div className="text-red-500 text-xl mb-2">⚠️ Error</div>
                <div className="text-gray-600">{error}</div>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full">
        <div className="w-full mx-auto">
            {userDetails && (
                <HumanBodyCheckSheet
                    tempId={employeeId!}
                    userDetails={userDetails}
                    onNext={handleAssessmentComplete}
                />
            )}
        </div>
    </div>
  );
};

export default HumanBodyCheckpointPage;