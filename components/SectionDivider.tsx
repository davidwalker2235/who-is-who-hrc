import React from 'react';

export default function SectionDivider() {
  return (
    <section className="w-full px-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="w-full">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
} 