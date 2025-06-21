"use client"

import React, { useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { useTranslation } from "next-i18next"
import { FaEnvelope } from "react-icons/fa"
import { trackEvent } from "../utils/tracking"

export default function ContactForm() {
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        message: ""
    })
    const [showError, setShowError] = useState(false) // Control error display
    const [isCaptchaOpen, setIsCaptchaOpen] = useState(false) // Control CAPTCHA opening
    const [captchaVerified, setCaptchaVerified] = useState(false) // Control CAPTCHA verification
    const [successMessage, setSuccessMessage] = useState(false) // Control success message display
    const [submitError, setSubmitError] = useState(false) // Control submission error display

    // Handle form field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // Base backend URL (NEXT_PUBLIC_API_URL from .env or fallback)
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
    // Send form data to backend along with CAPTCHA token
    const submitFormWithCaptcha = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, captcha_token: token })
            })
            return response.ok
        } catch {
            return false
        }
    } // CAPTCHA verification and data submission
    const handleCaptchaVerify = async (token: string) => {
        setCaptchaVerified(true)
        trackEvent("contact_form_captcha_verified")

        const result = await submitFormWithCaptcha(token)

        if (result) {
            trackEvent("contact_form_success")
            setTimeout(() => {
                setSuccessMessage(true)
                setFormData({ name: "", email: "", message: "" }) // Clear form
                setSubmitError(false)
            }, 500)
        } else {
            trackEvent("contact_form_error")
            setSubmitError(true)
            setSuccessMessage(false)
        }
    }

    // Email validation function
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Protection against empty fields and email validation
    const validateForm = () => {
        const newErrors = {
            name: formData.name ? "" : t("contact.errors.nameRequired"),
            email: formData.email
                ? isValidEmail(formData.email)
                    ? ""
                    : t("contact.errors.invalidEmail")
                : t("contact.errors.emailRequired"),
            message: formData.message ? "" : t("contact.errors.messageRequired")
        }

        setErrors(newErrors) // Check if there are no errors
        return !newErrors.name && !newErrors.email && !newErrors.message
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        trackEvent("contact_form_submitted")

        // Reset states on each submission attempt
        setCaptchaVerified(false)
        setSuccessMessage(false)
        setSubmitError(false)

        // Check if all fields are filled
        if (!validateForm()) {
            trackEvent("contact_form_validation_failed")
            setShowError(true)
            setTimeout(() => {
                setShowError(false)
            }, 2000)
            return
        } // If form is valid, open CAPTCHA
        trackEvent("contact_form_captcha_opened")
        setIsCaptchaOpen(true)
    }

    return (
        <section id="contact" className="py-20">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue">{t("contact.title")}</h2>
            <p className="text-lg text-center text-white mb-2">{t("contact.description")}</p>
            <p className="text-lg text-center text-white mb-4">
                <a
                    href={`mailto:${t("contact.email")}`}
                    className="inline-flex items-center justify-center gap-2 hover:text-blue transition-colors font-semibold"
                    onClick={() => trackEvent("email_click", { email: t("contact.email") })}
                >
                    <FaEnvelope />
                    <span className="select-all">{t("contact.email")}</span>
                </a>
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                <input
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={256}
                    className="max-w-2xl w-full p-4 rounded-3xl bg-black text-white shadow-convex focus:outline-none focus:shadow-concave_clicked hover:shadow-concave"
                />
                {showError && errors.name && <p className="text-red-500">{errors.name}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder={t("contact.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleInputChange}
                    maxLength={256}
                    className="max-w-2xl w-full p-4 rounded-3xl bg-black text-white shadow-convex focus:outline-none focus:shadow-concave_clicked hover:shadow-concave"
                />
                {showError && errors.email && <p className="text-red-500">{errors.email}</p>}
                <textarea
                    name="message"
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={handleInputChange}
                    maxLength={1500}
                    className="max-w-2xl w-full p-4 rounded-3xl bg-black text-white shadow-convex focus:outline-none h-32 min-h-32 resize-y focus:shadow-concave_clicked hover:shadow-concave"
                ></textarea>
                {showError && errors.message && <p className="text-red-500">{errors.message}</p>}
                {/* Form submission button */}
                <Button type="submit" variant="convexconcave" size="rounded" className="w-24 mt-6">
                    {t("contact.submitButton")}
                </Button>
            </form>
            {/* CAPTCHA Popout */}
            <Dialog open={isCaptchaOpen} onOpenChange={setIsCaptchaOpen}>
                <DialogContent className="bg-black p-6 rounded-3xl max-w-lg max-h-[80vh] overflow-y-auto text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">{t("contact.captchaTitle")}</DialogTitle>
                    </DialogHeader>
                    {captchaVerified && successMessage && (
                        <p className="text-center text-white">{t("contact.successMessage")}</p>
                    )}
                    {captchaVerified && submitError && (
                        <p className="text-center text-red-500">{t("contact.errorMessage")}</p>
                    )}
                    {!captchaVerified && (
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                            onSuccess={handleCaptchaVerify}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {successMessage && <p className="mt-4 text-center text-green-500">{t("contact.successMessage")}</p>}
            {submitError && <p className="mt-4 text-center text-red-500">{t("contact.errorMessage")}</p>}
        </section>
    )
}
