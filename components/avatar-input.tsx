"use client";

import Image from "next/image";

import { useRef, useState } from "react";

export default function AvatarInput({
  size = 150,
  value,
  onChange,
}: {
  size?: number;
  value?: string | null;
  onChange?: (file: File | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    value ?? null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onChange?.(file);
      const reader = new FileReader();
      reader.onload = (event) =>
        setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        name=""
        id=""
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        style={{ height: size + "px", width: size + "px" }}
        className="rounded-full overflow-hidden cursor-pointer hover:opacity-70 border-2 relative"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover rounded-full"
            unoptimized
          />
        ) : (
          <div className="flex justify-center items-center border-2 rounded-full h-full">
            <i className="pi pi-image" style={{ fontSize: "3rem" }}></i>
          </div>
        )}
      </div>
    </>
  );
}
