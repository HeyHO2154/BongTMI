import React, { useEffect, useState } from "react";

const Feed: React.FC = () => {
  const [base64Images, setBase64Images] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const imageFiles = [
        "/assets/base64_image_1.txt",
        "/assets/base64_image_2.txt",
        "/assets/base64_image_3.txt",
        "/assets/base64_image_4.txt",
        "/assets/base64_image_5.txt",
      ];

      const loadedImages: string[] = [];

      for (const file of imageFiles) {
        try {
          const response = await fetch(file);
          const base64Data = await response.text();
          loadedImages.push(base64Data);
        } catch (error) {
          console.warn(`Could not load ${file}:`);
        }
      }

      setBase64Images(loadedImages);
    };

    loadImages();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Feed Page</h1>
      {base64Images.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {base64Images.map((base64, index) => (
            <img
              key={index}
              src={base64}
              alt={`Base64 Image ${index + 1}`}
              style={{ width: "200px", height: "auto", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
            />
          ))}
        </div>
      ) : (
        <p>No images found</p>
      )}
    </div>
  );
};

export default Feed;
