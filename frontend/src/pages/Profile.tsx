import React from 'react';
import { useUser } from '../contexts/UserContext';
import UserProfile from '../components/UserProfile';

const Profile: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <UserProfile user={user} isCurrentUser={true} />
    </div>
  );
};

export default Profile;
