"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface Ilan {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  created_at?: string;
}
export default function HomePage() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    const fetchIlanlar = async () => {
      const { data, error } = await supabase
        .from("ilanlar")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("İlanlar yüklenirken hata:", error.message);
      } else {
        setIlanlar(data);
      }
    };

    fetchIlanlar();
  }, []);

  const handleCreateIlan = () => router.push("/ilan-olustur");

  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">İlan Sitesi</h1>
        <div className="space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                router.refresh();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </div>

      {/* Yeni İlan Butonu */}
      {user && (
        <div className="mb-6">
          <button
            onClick={handleCreateIlan}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Yeni İlan Oluştur
          </button>
        </div>
      )}

      {/* İlanlar Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ilanlar.map((ilan) => (
          <Link
            href={`/ilanlar/${ilan.id}`}
            key={ilan.id}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition group"
          >
            <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
              {ilan.image_url ? (
                <img
                  src={ilan.image_url}
                  alt={ilan.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition"
                />
              ) : (
                <span className="text-gray-500">Görsel Yok</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-white">
                {ilan.title}
              </h2>
              <p className="text-gray-400 line-clamp-2">{ilan.description}</p>
              <p className="mt-2 font-bold text-green-400">{ilan.price} ₺</p>
            </div>
          </Link>
        ))}
      </div>

      {ilanlar.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Henüz ilan bulunamadı.
        </p>
      )}
    </div>
  );
}
