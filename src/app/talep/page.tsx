"use client";

import RequestForm from "@/components/marketplace/request-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TalepPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <a
            href="/marketplace"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Pazar Yerine Dön
          </a>
        </div>

        {/* Role Check */}
        {(session?.user as any)?.role === "TRANSLATOR" || (session?.user as any)?.role === "STUDENT" ? (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2">Erişim Engellendi</h3>
            <p className="text-gray-600 mb-6">Tercümanlar veya öğrenciler yeni çeviri talebi oluşturamazlar. Bu özellik sadece işverenler içindir.</p>
            <button onClick={() => router.push("/marketplace")} className="px-6 py-2 bg-zinc-900 text-white rounded-lg">Pazar Yerine Dön</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <RequestForm
              onClose={() => router.push("/marketplace")}
              onSuccess={() => {}}
            />
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Talebiniz oluşturulduktan sonra ilgili tercümanlara otomatik
            bildirim gönderilir. Teklifler e-posta adresinize gelecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
