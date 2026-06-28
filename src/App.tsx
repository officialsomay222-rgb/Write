/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <iframe 
        src="https://loki-x-prime.vercel.app" 
        className="w-full h-full border-none"
        title="App Wrapper"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
