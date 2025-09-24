import LoginForm from '../../components/auth/LoginForm';
import GuestGuard from '../../guard/GuestGuard';

const LoginPage = () => {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">VuiHoi AI</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Welcome back! Please sign in to your account</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
};

export default LoginPage;
