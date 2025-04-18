"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Next.js App Router
import { supabase } from "@/lib/supabase";

export default function IlanDetayPage() {
  const params = useParams();
  const [ilan, setIlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIlan = async () => {
      if (!params?.id) return; // id gelmeden çalışmasın

      const { data, error } = await supabase
        .from("ilanlar")
        .select("*")
        .eq("id", params.id as string)
        .maybeSingle();

      if (error) {
        console.error("Hata:", error.message);
      } else {
        setIlan(data);
      }

      setLoading(false);
    };

    fetchIlan();
  }, [params?.id]);

  if (loading) return <p className="text-white">Yükleniyor...</p>;
  if (!ilan) return <p className="text-white">İlan bulunamadı.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-2xl mb-4">{ilan.title}</h1>
      <p>{ilan.description}</p>
      <p>
        <strong>Fiyat:</strong> {ilan.price} ₺
      </p>
      {ilan.image_url && (
        <img
          src={ilan.image_url}
          alt={ilan.title}
          className="w-full h-auto mt-4"
        />
      )}
    </div>
  );
}
