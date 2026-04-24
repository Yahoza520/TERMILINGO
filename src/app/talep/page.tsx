"use client";

import RequestForm from "@/components/marketplace/request-form";
import { useRouter } from "next/navigation";

export default function TalepPage() {
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <RequestForm
            onClose={() => router.push("/marketplace")}
            onSuccess={() => {}}
          />
        </div>

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
