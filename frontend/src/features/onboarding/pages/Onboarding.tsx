import { useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Shirt, Store, type IconType } from '@/shared/icons';
import { useNavigate } from '@/shared/router';
import Button from '@/shared/components/Button';
import { useOnboardingStore } from '../model/onboarding.store';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: IconType;
}

const slides: OnboardingSlide[] = [
  {
    title: 'Laundry Day, Simplified',
    description: 'Choose the care you need and place an order without leaving home.',
    icon: Shirt,
  },
  {
    title: 'Trusted Care Nearby',
    description: 'Discover local laundry partners, compare services, and order with confidence.',
    icon: Store,
  },
  {
    title: 'Track Every Step',
    description: 'Follow your order from confirmation until your clean laundry is back with you.',
    icon: Clock,
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const complete = useOnboardingStore((state) => state.complete);
  const navigate = useNavigate();
  const slide = slides[current];
  const lastSlide = current === slides.length - 1;

  const finish = () => {
    complete();
    navigate('/login', { replace: true });
  };

  const next = () => {
    if (lastSlide) finish();
    else setCurrent((index) => index + 1);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-card">
      <section className="relative flex min-h-[54%] flex-1 flex-col overflow-hidden bg-primary px-6 pb-10 pt-8 text-white">
        <div className="pointer-events-none absolute -right-16 -top-14 size-64 rounded-full border-[2rem] border-white/8" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-72 rounded-full border-[2rem] border-white/6" aria-hidden="true" />

        <div className="relative z-10 flex items-center justify-end">
          <button
            type="button"
            onClick={finish}
            className="min-h-11 rounded-xl px-3 text-sm font-semibold text-white/85 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-white"
          >
            Skip
          </button>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-8" aria-hidden="true">
          <div className="relative flex size-44 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <div className="absolute size-32 rounded-full border border-white/15" />
            <slide.icon size={76} className="text-white" />
          </div>
        </div>

      </section>

      <section className="relative z-20 -mt-6 rounded-t-[2rem] border-t border-stroke bg-card px-6 pb-7 pt-8">
        <div aria-live="polite">
          <p className="text-xs font-semibold text-primary">0{current + 1} / 0{slides.length}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text text-balance">{slide.title}</h1>
          <p className="mt-3 text-base leading-7 text-text-secondary text-pretty">{slide.description}</p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-label={`Slide ${current + 1} of ${slides.length}`}>
            {slides.map((item, index) => (
              <span
                key={item.title}
                className={index === current ? 'h-2 w-7 rounded-full bg-primary' : 'size-2 rounded-full bg-stroke-medium'}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {current > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrent((index) => index - 1)}
                aria-label="Previous Onboarding Screen"
                className="!size-12 !rounded-full !p-0"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </Button>
            )}
            <Button type="button" onClick={next} className="!min-h-12 !rounded-full !pl-5 !pr-4">
              {lastSlide ? 'Get Started' : 'Next'}
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
