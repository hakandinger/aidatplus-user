// components/UserRegistrationModal.jsx - Fixed Version
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobil detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
      console.log("📱 Is Mobile:", mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Modal trigger logic - FİX EDİLDİ
  useEffect(() => {
    const checkModalShown = () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const shown = localStorage.getItem("registrationModalShown");

          // Eğer timestamp varsa, kontrol et
          if (shown && shown !== "true") {
            const timestamp = parseInt(shown);
            const now = new Date().getTime();
            return now < timestamp; // Henüz zamanı gelmemişse true döner
          }

          return shown === "true";
        }
        return false;
      } catch (error) {
        console.log("LocalStorage not available");
        return false;
      }
    };

    const setModalShown = () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("registrationModalShown", "true");
        }
      } catch (error) {
        console.log("Cannot set localStorage");
      }
    };

    if (checkModalShown()) {
      console.log("📝 Modal already shown or not time yet");
      return;
    }

    // FİX: false olarak başlat
    let scrollTriggered = false;
    let timeTriggered = false;
    let touchTriggered = false;

    // Scroll handler
    const handleScroll = () => {
      if (scrollTriggered || touchTriggered) return;

      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercentage = scrolled / (documentHeight - windowHeight);
      const threshold = isMobile ? 0.15 : 0.3; // Mobilde %15, masaüstünde %30

      console.log("📜 Scroll %:", Math.round(scrollPercentage * 100));

      if (scrollPercentage > threshold) {
        scrollTriggered = true;
        console.log("📜 Scroll triggered modal");
        setIsOpen(true);
        setModalShown();
        cleanup();
      }
    };

    // FİX: Touch handler tanımlandı
    const handleTouchMove = () => {
      if (!isMobile || touchTriggered || scrollTriggered) return;

      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrolled / (documentHeight - windowHeight);

      if (scrollPercentage > 0.15) {
        touchTriggered = true;
        console.log("👆 Touch triggered modal");
        setIsOpen(true);
        setModalShown();
        cleanup();
      }
    };

    // Time-based trigger
    const timer = setTimeout(
      () => {
        if (!timeTriggered && !scrollTriggered && !touchTriggered) {
          timeTriggered = true;
          console.log("⏰ Time triggered modal");
          setIsOpen(true);
          setModalShown();
        }
      },
      isMobile ? 8000 : 12000 // Mobilde 8sn, masaüstünde 12sn
    );

    const cleanup = () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(timer);
    };

    // Event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    console.log(
      `🚀 Modal triggers activated. Mobile: ${isMobile}, Timer: ${
        isMobile ? 8 : 12
      }s`
    );

    return cleanup;
  }, [isMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("📤 Submitting form:", formData);

      const response = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("📥 API Response:", result);

      if (response.ok && result.success) {
        setSubmitted(true);

        // Google Analytics
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
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
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

    // Mobilde 12 saat, masaüstünde 24 saat sonra tekrar göster
    const nextShow = new Date();
    nextShow.setHours(nextShow.getHours() + (isMobile ? 12 : 24));

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          "registrationModalShown",
          nextShow.getTime().toString()
        );
      }
    } catch (error) {
      console.log("Cannot set next show time");
    }
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
          <div className="fixed inset-0  bg-opacity-5 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div
            className={`flex min-h-full ${
              isMobile ? "items-end" : "items-center"
            } justify-center ${isMobile ? "p-0" : "p-4"} text-center`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom={`opacity-0 ${
                isMobile ? "translate-y-full" : "scale-95"
              }`}
              enterTo={`opacity-100 ${
                isMobile ? "translate-y-0" : "scale-100"
              }`}
              leave="ease-in duration-200"
              leaveFrom={`opacity-100 ${
                isMobile ? "translate-y-0" : "scale-100"
              }`}
              leaveTo={`opacity-0 ${
                isMobile ? "translate-y-full" : "scale-95"
              }`}
            >
              <Dialog.Panel
                className={`w-full ${
                  isMobile ? "max-w-none" : "max-w-md"
                } transform overflow-hidden ${
                  isMobile ? "rounded-t-2xl" : "rounded-2xl"
                } bg-white shadow-xl transition-all ${
                  isMobile ? "max-h-[90vh] overflow-y-auto" : ""
                }`}
              >
                {!submitted ? (
                  <>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white relative">
                      <button
                        onClick={closeModal}
                        className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        aria-label="Kapat"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>

                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 rounded-full p-2">
                          <GiftIcon className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <Dialog.Title
                            className={`${
                              isMobile ? "text-base" : "text-lg"
                            } font-semibold`}
                          >
                            Bildirimlerden Haberdar Olun 🎉
                          </Dialog.Title>
                          <p className="text-sm text-white/90 mt-1">
                            Size özel duyurular ve bildirimler
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`px-6 ${isMobile ? "py-4" : "py-6"}`}>
                      {/* Benefits */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                          <ClockIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>Sadece 30 saniye sürer</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <ShieldCheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>Bilgileriniz güvende tutulur</span>
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
                            className={`w-full ${
                              isMobile
                                ? "px-3 py-3 text-base"
                                : "px-4 py-3 text-sm"
                            } text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                            style={{ fontSize: isMobile ? "16px" : "14px" }} // iOS zoom önleme
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
                              className={`w-full ${
                                isMobile
                                  ? "px-3 py-3 text-base"
                                  : "px-4 py-3 text-sm"
                              } text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                              style={{ fontSize: isMobile ? "16px" : "14px" }}
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
                              className={`w-full ${
                                isMobile
                                  ? "px-3 py-3 text-base"
                                  : "px-4 py-3 text-sm"
                              } text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
                              style={{ fontSize: isMobile ? "16px" : "14px" }}
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white ${
                            isMobile ? "py-4" : "py-3"
                          } px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
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
                      <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                        🔒 Bilgileriniz güvenli şekilde saklanır ve asla üçüncü
                        kişilerle paylaşılmaz.
                      </p>
                    </div>
                  </>
                ) : (
                  // Success state
                  <div
                    className={`px-6 ${isMobile ? "py-6" : "py-8"} text-center`}
                  >
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
                    <h3
                      className={`${
                        isMobile ? "text-lg" : "text-xl"
                      } font-semibold text-gray-900 mb-2`}
                    >
                      Teşekkürler! 🎉
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Bilgileriniz başarıyla kaydedildi. Önemli bildirimleri
                      yakında size ulaştıracağız!
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
