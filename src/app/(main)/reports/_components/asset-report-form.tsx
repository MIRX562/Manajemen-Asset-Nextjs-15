"use client";
import React, { useState } from "react";

export default function AssetReportForm() {
  const [assetName, setAssetName] = useState("");
  const [assetId, setAssetId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Asset Name:", assetName);
    console.log("Asset ID:", assetId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="assetName">Asset Name:</label>
        <input
          type="text"
          id="assetName"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="assetId">Asset ID:</label>
        <input
          type="text"
          id="assetId"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
