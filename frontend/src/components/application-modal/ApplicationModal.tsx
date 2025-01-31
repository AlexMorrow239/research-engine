import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

import { AdditionalInfoStep } from "./additional-info-step/AdditionalInfo";
import "./ApplicationModal.scss";
import { AvailabilityStep } from "./availability-step/AvailabilityStep";
import { ProgressStep } from "./progress-step/ProgressStep";
import { StudentInfoStep } from "./student-info-step/StudentInfo";
import { useApplicationForm } from "./useApplicationForm";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectId,
}) => {
  const {
    form,
    currentStep,
    isSubmitting,
    handleNextStep,
    handlePreviousStep,
    onSubmit,
  } = useApplicationForm(projectId, onClose);

  return (
    <Dialog open={isOpen} onClose={onClose} className="modal">
      <div className="modal__backdrop" aria-hidden="true" />

      <div className="modal__container">
        <DialogPanel className="modal__content">
          <div className="modal__header">
            <div className="modal__title-container">
              <DialogTitle className="modal__title">
                Research Position Application
                <span className="modal__title-project">{projectTitle}</span>
              </DialogTitle>
            </div>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <ProgressStep currentStep={currentStep} />

          <form
            onSubmit={(e) => {
              e.preventDefault();

              return form.handleSubmit((data) => {
                return onSubmit(data);
              })(e);
            }}
            noValidate
            encType="multipart/form-data"
          >
            {currentStep === 1 && <StudentInfoStep form={form} />}
            {currentStep === 2 && <AvailabilityStep form={form} />}
            {currentStep === 3 && <AdditionalInfoStep form={form} />}

            <div className="modal__footer">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="button button--secondary"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="button button--primary"
                    disabled={isSubmitting}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="button button--primary"
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? (
                      <span className="button__content">
                        <span className="spinner" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ApplicationModal;
