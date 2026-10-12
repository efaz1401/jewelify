import { motion, useScroll, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../seo/Seo.jsx';

export default function About() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -100]);

  return (
    <PageTransition>
      <Seo
        title="About Us — Earrings Curated for Bangladeshi Girls"
        description="Jewelify curates trendy, skin-friendly, budget-friendly earrings for girls and young women in Bangladesh. Cash on delivery, easy exchange."
        path="/about"
      />
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink-900">
        <motion.img
          style={{ y }}
          src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center px-4 text-white lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">About Jewelify</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Small details,<br /> big stories.
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-ink-600 lg:px-8">
        <p className="font-display text-2xl leading-relaxed text-ink-900">
          Jewelify was born from a simple idea: beautiful earrings should feel personal, not mass-produced.
        </p>
        <p className="mt-6">
          Every pair in our collection is handcrafted by small teams of jewelers who share our
          obsession with fit, finish, and the way light moves across metal. We source ethically,
          polish obsessively, and design to be worn every single day.
        </p>
        <p className="mt-4">
          From the barely-there gold dot to the show-stopping emerald dangle, we hope you find a
          pair that feels unmistakably yours.
        </p>
      </section>
    </PageTransition>
  );
}
