import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { auth, db } from '../firebase-config';
import { deleteDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';

const ConfirmDeleteUser = ({ setOpen }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteAllUserListings = async () => {
    try {
      const businessQuery = query(collection(db, 'businesses'), where('email', '==', auth.currentUser.email));
      const businessSnapshot = await getDocs(businessQuery);
      const deletePromises = businessSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting user listings: ', error);
      message.error('Error deleting user listings');
    }
  };

  const deleteUserFromFirestore = async () => {
    setIsLoading(true);
    try {
      // Delete all user listings
      await deleteAllUserListings();

      // Reauthenticate and delete user
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(auth.currentUser, provider);
      await auth.currentUser.delete();

      message.success('Account and all associated listings deleted successfully');
      navigate('/');
      setOpen(false);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        message.error('Please reauthenticate to delete your account');
        reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider())
          .then(() => {
            auth.currentUser.delete();
            message.success('Account deleted successfully');
            navigate('/');
            setOpen(false);
          })
          .catch((error) => {
            message.error('Reauthentication failed: ' + error.message);
          });
      } else {
        message.error('Failed to delete account: ' + error.message);
        console.error('Account deletion error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-4 text-sm text-gray-500 flex flex-col gap-4">
      <Button type="primary" danger onClick={deleteUserFromFirestore}>
        Confirm Delete
      </Button>
    </div>
  );
};

export default ConfirmDeleteUser;
