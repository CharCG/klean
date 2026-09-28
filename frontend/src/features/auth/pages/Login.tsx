import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@/shared/router';
import { Envelope, Lock } from '@/shared/icons';
import { useAuth } from '@/features/auth/model/use-auth';
import { useToast } from '@/shared/stores/toast-store';
import { showErrorToast } from '@/shared/errors/notify-error';
import Button from '@/shared/components/Button';
import AuthField from '@/features/auth/components/AuthField';
import { loginFormSchema } from '@/features/auth/model/auth.schemas';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = loginFormSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));

    if (!result.success) {
      showErrorToast(result.error);
      return;
    }

    setLoading(true);
    try {
      const loginResult = await login(result.data.email, result.data.password);
      showToast('Logged in successfully', 'success');
      const destination = loginResult.user.role === 'ADMIN' ? '/admin' : loginResult.user.role === 'MERCHANT' ? '/merchant' : '/';
      navigate(destination, { replace: true });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-primary">
      <header className="relative min-h-[17rem] shrink-0 overflow-hidden bg-primary px-6 pb-16 pt-16 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border-[2rem] border-white/8" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full border-[2rem] border-white/6" aria-hidden="true" />

        <div className="relative z-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-sm leading-6 text-white/80">Securely sign in with your email and password.</p>
        </div>
      </header>

      <section className="relative z-10 -mt-7 flex min-h-[31rem] flex-1 flex-col rounded-t-[2rem] border-t border-stroke bg-card px-6 pb-7 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text">Sign In</h2>
          <p className="mt-1 text-sm text-text-secondary">Use your Klean account to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <AuthField
            id="login-email"
            name="email"
            type="email"
            label="Email Address"
            icon={Envelope}
            autoComplete="email"
            placeholder="Enter your email"
            required
          />
          <AuthField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            icon={Lock}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />

          <Button type="submit" disabled={loading} isLoading={loading} variant="primary" fullWidth className="mt-1 !rounded-xl">
            Sign In
          </Button>
        </form>

        <p className="mt-auto pt-8 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary">
            Create Account
          </Link>
        </p>
      </section>
    </div>
  );
}
