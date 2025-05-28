
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSignUpSuccess = () => {
    navigate('/login');
  };

  return (
    <AuthCard
      header={
        <AuthHeader 
          title="Create your account"
          subtitle="Get started with Repair Auto Pilot"
        />
      }
      footer={
        <AuthFooter 
          linkText="Already have an account?"
          linkHref="/login"
          actionText="Sign in here"
        />
      }
    >
      <SignUpForm onSuccess={handleSignUpSuccess} />
    </AuthCard>
  );
}
