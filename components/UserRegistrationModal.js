// components/UserRegistrationModal.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  GiftIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function UserRegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    apartmentNumber: "",
    buildingNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const modalShown = localStorage.getItem("registrationModalShown");
    if (modalShown) {
      setHasShown(true);
      return;
    }

    let scrollTriggered = true;
    let timeTriggered = false;

    const handleScroll = () => {
      if (!scrollTriggered && window.scrollY > window.innerHeight * 0.4) {
        scrollTriggered = true;
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("registrationModalShown", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const timer = setTimeout(() => {
      if (!timeTriggered && !scrollTriggered) {
        timeTriggered = true;
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("registrationModalShown", "true");
      }
    }, 15000);

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("registrationModalShown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);

        if (typeof gtag !== "undefined") {
          gtag("event", "user_registration", {
            event_category: "engagement",
            event_label: "modal_registration",
          });
        }

        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsOpen(false);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem(
      "registrationModalShown",
      tomorrow.getTime().toString()
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {!submitted ? (
                  <>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative">
                      <button
                        onClick={closeModal}
                        className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>

                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 rounded-full p-2">
                          <GiftIcon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <Dialog.Title className="text-lg font-semibold">
                            Bildirimlerden Haberdar Olun 🎉
                          </Dialog.Title>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                      {/* Benefits */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                          <ClockIcon className="h-4 w-4 text-blue-500" />
                          <span>Sadece 30 saniye sürer</span>
                        </div>

                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                          <span>Bilgileriniz güvende</span>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon Numaranız *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="0555 123 45 67"
                            className="w-full px-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Blok No *
                            </label>
                            <input
                              type="text"
                              name="buildingNumber"
                              value={formData.buildingNumber}
                              onChange={handleInputChange}
                              placeholder="A, B, C..."
                              className="w-full px-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Daire No *
                            </label>
                            <input
                              type="text"
                              name="apartmentNumber"
                              value={formData.apartmentNumber}
                              onChange={handleInputChange}
                              placeholder="12, 34..."
                              className="w-full px-4 py-3 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Kaydediliyor...
                            </>
                          ) : (
                            "Bilgilerimi Kaydet 🚀"
                          )}
                        </button>
                      </form>

                      {/* Privacy note */}
                      <p className="text-xs text-gray-500 mt-4 text-center">
                        Bilgileriniz güvenli şekilde saklanır. İstemediğiniz
                        zaman çıkabilirsiniz.
                      </p>
                    </div>
                  </>
                ) : (
                  // Success state
                  <div className="px-6 py-8 text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Teşekkürler! 🎉
                    </h3>
                    <p className="text-gray-600">
                      Bilgileriniz kaydedildi. Size özel bildirimleri yakında
                      paylaşacağız!
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
