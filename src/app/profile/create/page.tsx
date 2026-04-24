"use client";

import ProfileBuilder from "@/components/profile/profile-builder";
import { ArrowLeft } from "lucide-react";

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profil Oluştur
          </h1>
          <p className="text-gray-500">
            Adım adım profilinizi oluşturun. İşverenler sizi bu bilgilerle bulacak.
          </p>
        </div>

        <ProfileBuilder />
      </main>
    </div>
  );
}
