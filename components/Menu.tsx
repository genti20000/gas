
import React from 'react';
import { useData } from '../context/DataContext';

const Menu: React.FC = () => {
  const { foodMenu } = useData();

  return (
    <section className="py-16 md:py-24 bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-4xl md:text-5xl font-bold">Fuel Your Performance</h3>
          <p className="text-lg md:text-xl text-gray-300 mt-4">
            Delicious bites and sharing plates to keep the party going all night long.
          </p>
        </div>

        <div className="max-w-6xl mx-auto columns-1 md:columns-2 gap-10 space-y-10">
          {foodMenu.map((category) => (
            <div key={category.category} className="break-inside-avoid mb-10 bg-black/20 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
              <h4 className="text-2xl font-bold text-yellow-400 mb-2">{category.category}</h4>
              {category.description && <p className="text-sm text-gray-400 italic mb-6">{category.description}</p>}
              <ul className="space-y-6">
                {category.items.map((item) => (
                  <li key={item.name} className="flex justify-between items-start gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-semibold text-white text-lg">{item.name}</h5>
                      <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                       {item.note && <p className="text-xs text-pink-400 mt-1">{item.note}</p>}
                    </div>
                    <span className="font-bold text-yellow-400 whitespace-nowrap text-lg">£{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
