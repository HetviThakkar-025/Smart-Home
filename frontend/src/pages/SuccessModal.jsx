import { motion, AnimatePresence } from "framer-motion";

const SuccessModal = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center text-white backdrop-blur-xl border border-white/20"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-3">Design Submitted!</h2>
            <p className="text-white/80 mb-6">{message}</p>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
