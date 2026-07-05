import React from 'react';

export default function RankingTable({ headers = [], data = [], renderRow }) {
  return (
    <div className="w-full overflow-x-auto border border-gris-borde rounded-md bg-superficie no-scrollbar">
      {data.length === 0 ? (
        <div className="p-8 text-center text-xs text-gris-secundario font-inter">
          No hay datos disponibles en este momento.
        </div>
      ) : (
        <table className="w-full border-collapse text-left text-sm font-inter">
          <thead>
            <tr className="border-b border-gris-borde">
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="px-4 py-3 bg-[#0c121b] text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-borde">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      )}
    </div>
  );
}
