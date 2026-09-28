import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@/shared/router';
import { ArrowLeft, Envelope, Lock, MapPin, Phone, User } from '@/shared/icons';
import { useToast } from '@/shared/stores/toast-store';
import { showErrorToast } from '@/shared/errors/notify-error';
import Button from '@/shared/components/Button';
import AuthField from '@/features/auth/components/AuthField';
import * as api from '@/features/auth/api/auth.api';
import { registerFormSchema } from '@/features/auth/model/auth.schemas';

export default function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: () => {
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    },
    onError: showErrorToast,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = registerFormSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));

    if (!result.success) {
      showErrorToast(result.error);
      return;
    }

    const { name, email, password, phone, address } = result.data;
    registerMutation.mutate({
      name,
      email,
      password,
      phone,
      address,
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-primary">
      <header className="relative min-h-[15rem] shrink-0 overflow-hidden bg-primary px-6 pb-14 pt-7 text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border-[2rem] border-white/8" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 left-1/4 size-72 rounded-full border-[2rem] border-white/6" aria-hidden="true" />

        <div className="relative z-10 flex items-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            aria-label="Back to Sign In"
            className="flex size-11 items-center justify-center rounded-full border border-white bg-white/95 text-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="relative z-10 mt-7">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-sm leading-6 text-white/80">Set up your customer profile and start ordering.</p>
        </div>
      </header>

      <section className="relative z-10 -mt-7 flex flex-1 flex-col rounded-t-[2rem] border-t border-stroke bg-card px-6 pb-7 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text">Sign Up</h2>
          <p className="mt-1 text-sm text-text-secondary">Tell us where we should deliver your clean laundry.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <AuthField id="register-name" name="name" label="Full Name" icon={User} autoComplete="name" placeholder="Enter your full name" required />
          <AuthField id="register-phone" name="phone" type="tel" label="Phone Number" icon={Phone} autoComplete="tel" placeholder="Enter your phone number" required />
          <AuthField id="register-email" name="email" type="email" label="Email Address" icon={Envelope} autoComplete="email" placeholder="Enter your email" required />
          <AuthField id="register-address" name="address" label="Delivery Address" icon={MapPin} autoComplete="street-address" placeholder="Enter your delivery address" required />
          <AuthField id="register-password" name="password" type="password" label="Password" icon={Lock} autoComplete="new-password" placeholder="Minimum 8 characters" minLength={8} required />
          <AuthField id="register-confirm-password" name="confirmPassword" type="password" label="Confirm Password" icon={Lock} autoComplete="new-password" placeholder="Repeat your password" minLength={8} required />

          <Button type="submit" disabled={registerMutation.isPending} isLoading={registerMutation.isPending} variant="primary" fullWidth className="mt-1 !rounded-xl">
            Create Account
          </Button>
        </form>

        <p className="pt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary">
            Sign In
          </Link>
        </p>
      </section>
    </div>
  );
}
