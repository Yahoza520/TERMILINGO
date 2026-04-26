"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const password = searchParams.get("p") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Otomatik focus
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Sadece rakam

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    // Sonraki input'a gec
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 6 hane dolunca otomatik dogrula
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (verifyCode?: string) => {
    const fullCode = verifyCode || code.join("");
    if (fullCode.length !== 6) {
      setError("6 haneli kodu girin.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Dogrulama basarisiz.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);

      // Otomatik giris yap
      if (password) {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!signInResult?.error) {
          setTimeout(() => {
            router.push("/marketplace");
            router.refresh();
          }, 1500);
          return;
        }
      }

      // Parola yoksa giris sayfasina yonlendir
      setTimeout(() => {
        router.push("/giris");
      }, 2000);
    } catch {
      setError("Bir hata olustu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMsg(data.message || "Yeni kod gonderildi.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setResendMsg("Kod gonderilemedi.");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Dogrulandi!</h1>
          <p className="text-gray-500 mb-6">Hesabiniz aktif. Yonlendiriliyorsunuz...</p>
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>
          </Link>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Dogrulama</h1>
          <p className="text-gray-500 text-sm">
            <strong className="text-gray-700">{email}</strong> adresine 6 haneli dogrulama kodu gonderdik.
          </p>
        </div>

        {/* Code Input */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
              {error}
            </div>
          )}
          {resendMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 mb-4">
              {resendMsg}
            </div>
          )}

          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 outline-none transition-all text-gray-900"
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={isLoading || code.join("").length !== 6}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-all disabled:opacity-50 mb-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Dogrula
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Kod gelmedi mi?</p>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-900 font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Yeni Kod Gonder
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link href="/kayit" className="text-sm text-gray-500 hover:text-gray-700">
            &#8592; Kayit sayfasina don
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
