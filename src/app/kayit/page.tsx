"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Building2, GraduationCap } from "lucide-react";
import Link from "next/link";

type UserType = "TRANSLATOR" | "EMPLOYER" | "STUDENT";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<UserType>("TRANSLATOR");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Parolalar eşleşmiyor.");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Parola en az 6 karakter olmalıdır.");
      setIsLoading(false);
      return;
    }

    try {
      // API'ye kayıt isteği gönder
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: userType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kayıt olurken bir hata oluştu.");
      }

      // Kayıt başarılıysa giriş yap
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (signInResult?.error) {
        throw new Error("Kayıt başarılı ancak giriş yapılamadı.");
      }

      router.push(userType === "EMPLOYER" ? "/marketplace" : "/profile/create");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo & Başlık */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluşturun</h1>
          <p className="text-gray-500">TermiLingo'ya katılın ve tercüman ağınıza erişin</p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: "TRANSLATOR", label: "Tercüman", icon: User, desc: "Çeviri hizmeti verecek" },
            { value: "EMPLOYER", label: "İşveren", icon: Building2, desc: "Tercüman arayacak" },
            { value: "STUDENT", label: "Öğrenci", icon: GraduationCap, desc: "Mentorluk alacak" },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = userType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setUserType(type.value as UserType)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-zinc-900" : "text-gray-500"}`} />
                <div className="font-medium text-sm text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ornek@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parola
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parola Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-zinc-900 focus:ring-zinc-900" />
              <p className="text-xs text-gray-600">
                <Link href="/kvkk" className="text-zinc-900 font-medium hover:underline">
                  Aydınlatma Metni
                </Link>
                {" "}ve{" "}
                <Link href="/gizlilik" className="text-zinc-900 font-medium hover:underline">
                  Gizlilik Politikası
                </Link>
                {' '}ni okudum ve kabul ediyorum.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Hesap Oluştur
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-zinc-900 hover:text-black font-medium">
              Giriş yapın
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
