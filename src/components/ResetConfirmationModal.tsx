import { motion, AnimatePresence } from 'framer-motion';
import './ResetConfirmationModal.css';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  petName: string;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  petName
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reset-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="reset-modal-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="reset-modal-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚠️
            </motion.div>

            <h2 className="reset-modal-title">¿Reiniciar Tamagotchi?</h2>

            <p className="reset-modal-message">
              Esto eliminará a <strong>{petName}</strong> y creará un nuevo tamagotchi.
            </p>

            <p className="reset-modal-warning">
              ⚠️ Esta acción <strong>no se puede deshacer</strong>
            </p>

            <div className="reset-modal-buttons">
              <motion.button
                className="reset-modal-btn cancel"
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>

              <motion.button
                className="reset-modal-btn confirm"
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sí, reiniciar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetConfirmationModal;
