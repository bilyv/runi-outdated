import { useEffect } from "react";
import { Portal } from "./Portal";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className = "" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md"
            />

            {/* Glowing background effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute pointer-events-none"
            >
              <div className="w-[300px] h-[300px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px]" />
            </motion.div>

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
              className={`
                relative w-full max-w-sm overflow-hidden
                bg-white/70 dark:bg-black/40 backdrop-blur-xl
                rounded-[2rem] border border-white/40 dark:border-white/10
                shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                font-sans tracking-tight ${className}
              `}
            >
              {/* Backglow element */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-2xl" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                {title && (
                  <h3 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 group"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
