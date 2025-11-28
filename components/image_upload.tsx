"use client";

import Image from "next/image";

import { useRef, useState } from "react";

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
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
        className="w-[150px] h-[150px] rounded-full overflow-hidden cursor-pointer hover:opacity-70 border-2"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Preview"
            width={150}
            height={150}
            className="object-cover"
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
