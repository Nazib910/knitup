import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { motion } from 'framer-motion';

// Marketing homepage hero + features. PRD §4 / §6 marketing.
const FEATURES = [
  {
    title: 'Real-time 3D preview',
    body: 'See your design rendered as a photorealistic knitted garment as you customise stitch, color, and gauge.',
  },
  {
    title: 'Premium yarns, five tiers',
    body: 'From everyday BCI cotton to ethically-sourced cashmere — pick the price tier that suits your collection.',
  },
  {
    title: 'Production-ready',
    body: 'When you are happy with your design, place a manufacturing order and integrate with your Shopify store.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-knitup-bgSoft">
        <div className="max-w-container mx-auto px-5 py-20 lg:py-28 grid grid-cols-12 gap-6 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="col-span-12 lg:col-span-7"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
              className="text-h1 font-display text-knitup-gray leading-tight"
            >
              Custom knitwear,
              <br />
              designed in your browser.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-6 text-lg text-knitup-text max-w-xl leading-relaxed"
            >
              Pick a silhouette, choose a yarn, customise the stitch and color, and place a
              manufacturing order — all from one studio.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/design/studio">
                <Button type="primary" size="large">
                  Start Creating
                </Button>
              </Link>
              <Link to="/about">
                <Button size="large">Learn More</Button>
              </Link>
            </motion.div>
          </motion.div>
          <div className="col-span-12 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-card border border-knitup-lighter p-8 flex items-center justify-center"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src="/silhouettes/mens-oversized-crew.svg"
                alt=""
                className="w-3/4 h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-container mx-auto px-5 py-20">
        <h2 className="text-h2 font-display text-knitup-gray mb-12">How it works</h2>
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="col-span-12 md:col-span-4"
            >
              <div className="text-knitup-light text-sm mb-2">0{i + 1}</div>
              <h3 className="text-h3 text-knitup-gray font-semibold mb-3">{f.title}</h3>
              <p className="text-knitup-text">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-knitup-gray text-white">
        <div className="max-w-container mx-auto px-5 py-20 text-center">
          <h2 className="text-h2 font-display mb-6">Ready to make something?</h2>
          <Link to="/design/studio">
            <Button type="primary" size="large" ghost className="border-white text-white">
              Open the Studio
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
