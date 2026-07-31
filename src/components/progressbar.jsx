import { motion } from "framer-motion";

const ProgressBar = ({ progress = 72, height = "h-7", animated = true }) => {
  return (
    <div className="relative flex w-full items-center gap-4">
      {/* Track */}
      <div
        className={`relative ${height} flex-1 overflow-hidden rounded-full border border-orange-300/60 bg-white/40 shadow-inner backdrop-blur-md`}
      >
        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
        >
          {/* Moving Stripes */}
          {animated && (
            <motion.div
              animate={{
                backgroundPosition: ["0px 0px", "40px 0px"],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
              }}
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    -45deg,
                    rgba(255,255,255,.55) 0px,
                    rgba(255,255,255,.55) 10px,
                    transparent 10px,
                    transparent 20px
                  )
                `,
                backgroundSize: "40px 40px",
              }}
            />
          )}

          {/* Shine Sweep */}
          {animated && (
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "600%" }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="absolute top-0 h-full w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)",
                filter: "blur(10px)",
              }}
            />
          )}

          {/* Soft Glow */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "0 0 25px rgba(249,115,22,.35) inset",
            }}
          />
        </motion.div>
      </div>

      {/* Percentage */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-14 text-right text-lg font-semibold text-orange-500"
      >
        {progress}%
      </motion.span>
    </div>
  );
};

export default ProgressBar;
