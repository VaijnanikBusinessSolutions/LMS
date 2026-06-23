


import React from 'react';
import Level0Nav from "../Level0Nav/Level0Nav";
import { UserInfoForm } from '../../organisms/UserInfoForm/UserInfoForm';
// import { PageHeader } from '../../atoms/PageHeader/PageHeader';
// import { User } from 'lucide-react';

const UserInfoEntry: React.FC = () => {
  return (
    <>
      <Level0Nav />
      <div className="min-h-screen bg-background text-text">
        <div className="w-full mx-auto">
              <UserInfoForm />
        </div>
      </div>
    </>
  );
};

export default UserInfoEntry;